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
        let websocketClientDocs;
        try {
            websocketClientDocs = await websocketInfoRef.get();
        }
        catch (error) {
            console.error("fail to get websocketClientDocs");
            console.error(error);
        }
        let callbackURL = "";
        if (websocketClientDocs !== undefined && websocketClientDocs.empty !== true) {
            const all_docs = websocketClientDocs.docs;
            for (const doc of all_docs) {
                console.log("prepare send message(" + doc.id + ") cec_control at Websocket");
                callbackURL = "https://" + doc.data().domain + "/" + doc.data().stage;

                // create websocket client
                const websocketClient = new ApiGatewayManagementApiClient({
                    endpoint: callbackURL
                });

                // send message to websocket
                const params = {
                    Data: JSON.stringify({
                        action: "showPicNowLivCam",
                    }),
                    ConnectionId: doc.id,
                };
                const command = new PostToConnectionCommand(params);

                try {
                    await websocketClient.send(command);
                    console.log("send message to " + callbackURL + " with ID(" + doc.id + ").");
                }
                catch (error) {
                    console.error(error);
                }
            };
        }
        else {
            console.error("websocketClientDocs is undefined");
        }
        console.error("end of action=showPicNowLivCam...");
    }
}

export default showPicture;
