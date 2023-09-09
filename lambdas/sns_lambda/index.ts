'use strict';

import { getSenderIDs } from './tools_functions.js';
import { line_client } from './line_functions.js';

export const handler = async (event) => {
    // receive message from SNS
    console.log(event);
    const message = JSON.parse(event.Records[0].Sns.Message);

    // check message type
    if (message.type == 'livcam' || message.type == 'entcam') {
        // send line message
        const senderIDs = await getSenderIDs('get' + message.type, 30);

        if (senderIDs == null) {
            console.log('No senderIDs...');
            // return 500 error
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'No senderIDs...',
                }),
            };
        }
        else {
            console.log('senderIDs data:', senderIDs);

            for (const senderID of senderIDs) {
                await line_client.pushMessage(senderID, {
                    type: "image",
                    originalContentUrl: process.env.CAMERA_DATA_LOCATION_URL + process.env.CAMERA_DATA_ORIGFILENAME
                        + "?url_token=" + process.env.CAMERA_DATA_URL_TOKEN + "?type=" + message.type,
                    previewImageUrl: process.env.CAMERA_DATA_LOCATION_URL + process.env.CAMERA_DATA_PREVFILENAME
                        + "?url_token=" + process.env.CAMERA_DATA_URL_TOKEN + "?type=" + message.type,
                });
            }
        }
    }
};
