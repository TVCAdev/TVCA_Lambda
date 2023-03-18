"use strict";

import db, { doc_converter, stateInRoomTable } from './db_functions.js';
import line from '@line/bot-sdk';

/**
 * get In Room Information.
 */
async function getInRoom(line_client: line.Client, event: line.PostbackEvent) {

    // read inroom status
    const inroomRef = db.doc('state/inroom').withConverter(doc_converter<stateInRoomTable[]>());

    const doc = await inroomRef.get();
    if (!doc.exists) {
        console.log('document inroom was not exist.');
    } else {
        let text_string = "";
        let actions: line.Action[] = [];
        let dbdata: stateInRoomTable[] | undefined = doc.data();
        if (dbdata != undefined) {
            console.log('Document data:', dbdata);

            for (const InRoomData of dbdata) {

                // get registration information for TVbans
                if (InRoomData.inState == false) {
                    text_string = text_string + InRoomData.roomName + "：不在\n";
                }
                else {
                    text_string = text_string + InRoomData.roomName + "：在室\n";
                }
                let tmpAction: line.Action = {
                    label: InRoomData.roomName + "のログ表示",
                    type: "postback",
                    data: "action=showInroomLogs&room=" + InRoomData.roomName,
                };

                actions.push(tmpAction);
            };

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
}

export default getInRoom;
