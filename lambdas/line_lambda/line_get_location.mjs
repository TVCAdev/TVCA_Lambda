"use strict";

import db from './db_functions.mjs';
import {setSenderID} from './tools_functions.mjs';
import firebaseadmin from 'firebase-admin';
/*
 send notification message for getting location.
 */
async function sendNotification() {
    // get token from location document.
    const locRef = db.collection('config').doc('location');
    const doc = await locRef.get();
    if (!doc.exists) {
            console.log('document location was not exist.');
    } else {
        const dbdata = doc.data();
        console.log('Document data:', dbdata);

        // get registration token
        if ("token" in dbdata) {
            const message = {
                data: {
                    action: 'GET_LOCATION'
                },
                token: dbdata.token
            };

            // Send a message to the device corresponding to the provided
            // registration token.
            const response = firebaseadmin.messaging().send(message);
            if(response){
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
function getLocation(client, event) {
    
    // register sender ID
    if (event.source.type == "user" && setSenderID("getlocation", event.source.userId) == true) {
        sendNotification();
    }
}

export default getLocation;
