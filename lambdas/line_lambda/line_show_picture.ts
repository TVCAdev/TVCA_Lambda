"use strict";

import db from './db_functions.js';
import line from '@line/bot-sdk';
import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

/**
 * show In Room Logs.
 */
async function showPicture(line_client: line.Client, event: line.PostbackEvent) {

    // check event.postback.data
    if (event.postback.data == "action=showPicNowLivCam") {
        // send message cec_control at Websocket
        console.log("send message cec_control at Websocket");

        // get callback URL from DB
        const websocketInfoRef = db.collection('state/websockets/getlivcam_connected');
        const websocketClientDocs = await websocketInfoRef.get();
        let callbackURL = "";
        websocketClientDocs.forEach(doc => {
            callbackURL = doc.data().domain + "/" + doc.data().stage + "/@connections/" + doc.id;

            // create websocket client
            const websocketClient = new ApiGatewayManagementApiClient({
                apiVersion: "2018-11-29",
                endpoint: callbackURL,
            });

            // send message to websocket
            const params = {
                Data: JSON.stringify({
                    action: "showPicNowLivCam",
                }),
                ConnectionId: doc.id,
            };
            const command = new PostToConnectionCommand(params);
            websocketClient.send(command);
        }
        );


    }
}

export default showPicture;
