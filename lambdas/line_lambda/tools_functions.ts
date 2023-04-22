'use strict';

import date_fns from 'date-fns';
import db, { doc_converter, requestTable } from './db_functions.js';
import firebaseadmin from 'firebase-admin';


// function for setting sender ID
export async function setSenderID(target: string, setID: string) {
    // get token from location document.
    const targetRef = db.collection('request/' + target + '/senderIDs').withConverter(doc_converter<requestTable>());

    // create now time
    const nowDate = new Date();

    let set_req: requestTable = {
        reqDate: firebaseadmin.firestore.Timestamp.fromDate(nowDate),
    }

    // set sender IDs
    try {
        await targetRef.doc(setID).set(set_req);
    }
    catch
    {
        console.log('register ' + setID + ' in request of ' + target + '.');
    }
}

// function for getting sender ID
export async function getSenderIDs(target: string, targetDiffSec: number) {
    // get sender IDs from location document.
    const targetRef = db.collection('request/' + target + '/senderIDs').withConverter(doc_converter<requestTable>());

    const querySnap = await targetRef.get();
    if (querySnap.empty) {
        console.log('sender IDs for ' + target + ' are not exist.');
    } else {
        const senderIDs: string[] = [];
        querySnap.forEach(async docSnap => {
            const requestData = docSnap.data();
            // compare request time
            let convDate = requestData.reqDate.toDate();
            const nowDate = new Date();
            const diffSec = date_fns.differenceInSeconds(nowDate, convDate);
            if (diffSec <= targetDiffSec) {
                senderIDs.push(docSnap.id);
            }

            // delete request
            await docSnap.ref.delete();
        });

        // return sender ID array.
        return senderIDs;
    }
}
