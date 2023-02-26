"use strict";

import db from './db_functions.mjs';

/**
 * show In Room Logs.
 */
async function showInRoomLogs(client, event) {

    // get room_name from postback data
    let roomName = event.postback.data.substr(27);
    let logtext = roomName + 'のログ一覧(最新20件)\n';

    // view logs of target room name
    const querySnapshot = await db.collection('log').doc('Inroom').collection('Logs')
        .where('name', '=', roomName)
        .orderBy('date', 'desc').limit(20)
        .get();

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    querySnapshot.forEach(queryDocumentSnapshot => {
        let data = queryDocumentSnapshot.data();
        let date = data.date.toDate();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hour = ("0" + date.getHours()).slice(-2);
        let min = ("0" + date.getMinutes()).slice(-2);
        let sec = ("0" + date.getSeconds()).slice(-2);

        let showDate = `${year}/${month}/${day} ${hour}:${min}:${sec}`;
        logtext = logtext + ' ' + showDate + '-> ' + data.action + 'しました。\n';
        console.log('logtext is %s.', logtext);
    });

    console.log('Send Messages...');
    // send log data
    await client.replyMessage(event.replyToken, {
        type: "text",
        text: logtext,
    });

}

export default showInRoomLogs;
