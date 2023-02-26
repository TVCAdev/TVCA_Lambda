"use strict";

import db from './db_functions.mjs';

/**
 * get In Room Information.
 */
async function getInRoom(client, event) {
    
    // read inroom status
    const inroomRef = db.collection('state').doc('inroom');

    const doc = await inroomRef.get();
    if (!doc.exists) {
        console.log('document inroom was not exist.');
    } else {
        let text_string = "";
        let actions = new Array();

        const dbdata = doc.data();
        console.log('Document data:', dbdata);

        // make Inroom status information
        Object.keys(dbdata).forEach(key => {
            let newData = new Object();
            newData.type = "postback";

            // get registration information for TVbans
            if (dbdata[key] == false) {
                text_string = text_string + key + "：不在\n";
            }
            else {
                text_string = text_string + key + "：在室\n";
            }
            newData.label = key + "のログ表示";
            newData.data = "action=showInroomLogs&room=" + key;

            actions.push(newData);
        });

        // return button template
        return client.replyMessage(event.replyToken, {
            type: "template",
            altText: "在室状況",
            template: {
                type: "buttons",
                text: text_string,
                actions: actions
            }
        });
    }
}

export default getInRoom;
