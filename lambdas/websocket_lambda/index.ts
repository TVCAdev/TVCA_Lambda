'use strict';

import db, { doc_converter, requestTable } from './db_functions.js';
import firebaseadmin from 'firebase-admin';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// function to add websocket's connecton ID
async function addConnectionID(target: string, setID: string, setDomain: string, setStage: string) {
    // get token from location document.
    const targetRef = db.collection('state/websockets/' + target + '_connected');

    // create now time
    const nowDate = new Date();

    let set_req = {
        reqDate: firebaseadmin.firestore.Timestamp.fromDate(nowDate),
        domain: setDomain,
        stage: setStage,
    }

    // set websockets connection IDs
    return await targetRef.doc(setID).set(set_req);
}

// function to websocket's connecton ID
async function deleteConnectionID(target: string, deleteID: string) {
    // delete websockets connection IDs
    return await db.collection('state/websockets/' + target + '_connected').doc(deleteID).delete();
}

export const handler = async (event) => {
    console.log(event);
    let ok_flg = true;
    switch (event.requestContext.routeKey) {
        case '$connect':
            console.log('connection was detected.');
            // add connectionId,domain,stage to DB
            if (event.requestContext.connectionId) {
                try {
                    await addConnectionID('getlivcam', event.requestContext.connectionId,
                        event.requestContext.domainName, event.requestContext.stage);
                }
                catch {
                    console.log('register connectionId of getlivcam request was failed');
                    ok_flg = false;
                    break;
                }
            }
            else {
                ok_flg = false;
            }
            break;

        case '$disconnect':
            console.log('disconnection was detected.');
            // delete connectionId from DB
            if (event.requestContext.connectionId) {
                try {
                    await deleteConnectionID('getlivcam', event.requestContext.connectionId);
                }
                catch {
                    console.log('unregister connectionId of getlivcam request was failed');
                    ok_flg = false;
                    break;
                }
            }
            else {
                ok_flg = false;
            }
            break;

        case 'SendCamData':
            console.log("reply of GET_LIVINGPIC was received")
            // get camera data(base64) from body.camdata
            const recvdata = JSON.parse(event.body);
            const camdata = recvdata.image_data;
            const occured_date = recvdata.occured_date;
            const type = recvdata.type;

            // get document from firebase
            const targetRef = db.doc('request/' + type)
            // put camdata to document(getlivcam) in firebase as field camdata
            try {
                await targetRef.set({ camdata: camdata, occured_date: occured_date });
            }
            catch {
                console.log('put camdata to getlivcam was failed');
                ok_flg = false;
            }

            // send aws sns to lambda by topic camera_data
            const sns = new SNSClient({ region: 'us-east-1' });
            const params = {
                Message: JSON.stringify({ type: type }),
                TopicArn: process.env.CAMDATA_TOPIC_ARN
            };
            try {
                await sns.send(new PublishCommand(params));
            }
            catch {
                console.log('send sns was failed');
                ok_flg = false;
            }

            break;

        default:
            ok_flg = false;
            break;
    }
    // Return a response depending on the value of ok_flg
    const response = {
        statusCode: ok_flg ? 200 : 500,
    };

    return response;
};
