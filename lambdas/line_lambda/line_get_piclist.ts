"use strict";

import line from '@line/bot-sdk';

/**
 * get In Room Information.
 */
async function getPicList(line_client: line.Client, event: line.PostbackEvent) {

    return line_client.replyMessage(event.replyToken, {
        type: "template",
        altText: "This is a buttons template",
        template: {
            type: "buttons",
            title: "画像一覧",
            text: "見たい画像を選択してください。",
            actions: [
                {
                    "type": "postback",
                    "label": "リビングの現在画像",
                    "data": "action=showPicNowLivCam"
                },
                {
                    "type": "postback",
                    "label": "リビングの最終人画像",
                    "data": "action=showPicLastLivCam"
                },]
        }
    });
}


export default getPicList;
