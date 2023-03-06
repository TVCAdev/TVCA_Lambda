"use strict";

import line, { MessageEvent } from '@line/bot-sdk';

/**
 * Show LINE top menu.
 */
function lineShowTopmenu(line_client: line.Client, event: MessageEvent) {

    return line_client.replyMessage(event.replyToken, {
        type: "template",
        altText: "This is a buttons template",
        template: {
            type: "buttons",
            title: "お願いしたいこと",
            text: "アクションを選択してください。",
            actions: [
                {
                    "type": "postback",
                    "label": "リビングの現在画像",
                    "data": "action=getpic"
                },
                {
                    "type": "postback",
                    "label": "パパの現在地",
                    "data": "action=getloc"
                },
                {
                    "type": "postback",
                    "label": "在室状況",
                    "data": "action=getInRoom"
                },
                {
                    "type": "postback",
                    "label": "TVの禁止設定",
                    "data": "action=TVStatus"
                },]
        }
    });
}

export default lineShowTopmenu;
