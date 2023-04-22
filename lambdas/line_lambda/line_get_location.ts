"use strict";

import db, { doc_converter, configLocationTable } from './db_functions.js';
import { setSenderID } from './tools_functions.js';
import firebaseadmin from 'firebase-admin';
import line from '@line/bot-sdk';

/*
 send notification message for getting location.
 */
async function sendNotification() {
    // get token from location document.
    const locRef = db.collection('config').doc('location').withConverter(doc_converter<configLocationTable>());
    const doc = await locRef.get();
    if (!doc.exists) {
        console.log('document location of config was not exist.');
    } else {
        const locData = doc.data();
        console.log('Document data:', locData);

        // get registration token
        if (locData != undefined) {
            const message = {
                data: {
                    action: 'GET_LOCATION'
                },
                token: locData.token,
            };

            // Send a message to the device corresponding to the provided
            // registration token.
            const response = await firebaseadmin.messaging().send(message);
            if (response) {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            } else {
                console.log('Error sending message.');
            }
        } else {
            console.log('token was not registerd');
        }
    }
}

/**
 * send Notification to get location.
 */
async function getLocation(line_client: line.Client, event: line.PostbackEvent) {

    console.log('event data:', event);

    // register sender ID
    if (event.source.type == "user") {
        try {
            await setSenderID('getlocation', event.source.userId);
            await sendNotification();
        }
        catch {
            console.log('register senderID of getlocation request was failed');
        }
    }
}

export default getLocation;
