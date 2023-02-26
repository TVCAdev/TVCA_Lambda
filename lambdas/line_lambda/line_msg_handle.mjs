"use strict";

import express from 'express';
import lineShowTopmenu from './line_show_topmenu.mjs';
import getInRoom from './line_get_inroom.mjs';
import showInRoomLogs from './line_show_inroom_logs.mjs';
import getLocation from './line_get_location.mjs';
import line from '@line/bot-sdk';
import { line_client, line_config} from './line_functions.mjs';


/**
 * set line handler function.
 */
function line_msg_handle(app) {
    // register function called when line message is received from LINE.
    app.post("/callback", line.middleware(line_config), express.json(), (req, res) => {
        console.log(req);
        res.set('Content-Type', 'application/json; charset=UTF-8');
        Promise.all(req.body.events.map(handleEvent)).then((result) =>
            res.json(result)
        );
    });
}

/**
 * handler called when line message is received.
 */
function handleEvent(event) {

    // type is message
    if (event.type == "message") {
        console.log("LINE message was received.");
        // show top menu
        return lineShowTopmenu(line_client, event);
    }
    // type is postback
    else if (event.type == "postback") {
        console.log("LINE postback(%s) was received.", event.postback.data);

        // selected show Inroom Logs
        if (event.postback.data == "action=getInRoom") {
            return getInRoom(line_client, event);
        }

        // selected get InRoom
        else if (event.postback.data.startsWith("action=showInroomLogs")) {
            return showInRoomLogs(line_client, event);
        }

        // selected GET LOCATION
        else if (event.postback.data == "action=getloc") {
            return getLocation(line_client, event);
        }

        else {
            // receive only text message or postback
            return Promise.resolve(null);
        }
    }
    
    return Promise.resolve(null);
}

export default line_msg_handle;
