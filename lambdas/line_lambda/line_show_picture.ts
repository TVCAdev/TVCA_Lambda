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
        websocketClientDocs.forEach(async doc => {
            callbackURL = "https://" + doc.data().domain + "/" + doc.data().stage;
            console.log("send message to " + callbackURL + " with ID(" + doc.id + ").");

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
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}

export default showPicture;
