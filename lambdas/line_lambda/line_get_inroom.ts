"use strict";

import db, { doc_converter, stateInRoomTable } from './db_functions.js';
import line from '@line/bot-sdk';

/**
 * get In Room Information.
 */
async function getInRoom(line_client: line.Client, event: line.PostbackEvent) {

    // read inroom status
    const roomsRef = db.collection('state/inroom/rooms').withConverter(doc_converter<stateInRoomTable>());

    const querySnap = await roomsRef.get();
    if (querySnap.empty) {
        console.log('document inroom was not exist.');
    } else {
        let text_string = "";
        let actions: line.Action[] = [];
        querySnap.forEach(docSnap => {
            const InRoomData: stateInRoomTable = docSnap.data();
            // get registration information for TVbans
            if (InRoomData.inState == false) {
                text_string = text_string + docSnap.id + "：不在\n";
            }
            else {
                text_string = text_string + docSnap.id + "：在室\n";
            }
            let tmpAction: line.Action = {
                label: docSnap.id + "のログ表示",
                type: "postback",
                data: "action=showInroomLogs&room=" + docSnap.id,
            };

            actions.push(tmpAction);
        });

        // return button template
        const message: line.TemplateMessage = {
            type: "template",
            altText: "在室状況",
            template: {
                type: "buttons",
                text: text_string,
                actions: actions
            }
        };

        return line_client.replyMessage(event.replyToken, message);
    }
}


export default getInRoom;
