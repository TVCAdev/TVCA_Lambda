"use strict";

import { format, parse, differenceInSeconds } from 'date-fns';
import db from './db_functions.mjs';

// function for setting sender ID
export async function setSenderID(target, setID) {
    if (setID) {
        // get token from location document.
        const targetRef = db.collection('request').doc(target);
        const doc = await targetRef.get();
        if (!doc.exists) {
                console.log('document ' + target + ' was not exist.');
        } else {
            let set_obj = {};
            const date = new Date();
            set_obj[setID] = format(date, 'yyyyMMddHHmmss');
            await targetRef.update(set_obj);
            console.log('SenderID ' + setID + ' was registerd.');
            return true;
        }
    }
    return false;
}

// function for setting sender ID
export async function getSenderIDs(target, timeout) {
    // get token from location document.
    const targetRef = db.collection('request').doc(target);
    const doc = await targetRef.get();
    if (!doc.exists) {
            console.log('document ' + target + ' was not exist.');
    } else {
        const doclist = doc.data();
        if (doclist){
            const ret = new Array();
            for (const key in doclist) {
                const req_time = doclist[key];
                const convDate = parse(req_time, 'yyyyMMddHHmmss', new Date());
                const nowDate = new Date();
                const diffSec = differenceInSeconds(nowDate, convDate);
                if (diffSec <= 30){
                    ret.push(key);
                }
            }

            // return sender ID array.
            return ret;
        }
    }
    return null;
}
