"use strict";

import db, { doc_converter, logInroomLogsTable } from './db_functions.js';
import date_fns from 'date-fns';
import line from '@line/bot-sdk';

/**
 * show In Room Logs.
 */
async function showInRoomLogs(line_client: line.Client, event: line.PostbackEvent) {

    // get room_name from postback data
    let roomName = event.postback.data.substr(27);
    let logtext = roomName + 'のログ一覧(最新20件)\n';

    // view logs of target room name
    const querySnapshot = await db.collection('log/Inroom/Logs')
        .withConverter(doc_converter<logInroomLogsTable>())
        .where('name', '==', roomName)
        .orderBy('date', 'desc').limit(20)
        .get();

    if (querySnapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    querySnapshot.forEach(queryDocumentSnapshot => {
        let data = queryDocumentSnapshot.data();
        let date: Date = data.date.toDate();
        let showDate = date_fns.format(date, 'yyyy/MM/dd HH:mm:ss');

        logtext = logtext + ' ' + showDate + '-> ' + data.action + 'しました。\n';
        console.log('logtext is %s.', logtext);
    });

    console.log('Send Messages...');
    // send log data
    await line_client.replyMessage(event.replyToken, {
        type: "text",
        text: logtext,
    });

}

export default showInRoomLogs;
