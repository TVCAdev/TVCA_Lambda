'use strict';

import date_fns from 'date-fns';
import db, { doc_converter, requestTable } from './db_functions.js';

// function for setting sender ID
export async function setSenderID(target: string, setID: string) {
    if (setID) {
        // get token from location document.
        const targetRef = db.collection('request').doc(target).withConverter(doc_converter<requestTable[]>());
        const doc = await targetRef.get();
        if (!doc.exists) {
            console.log('document ' + target + ' was not exist.');
        } else {
            const date = new Date();
            let set_req: requestTable = {
                userID: setID,
                reqDate: date_fns.format(date, 'yyyyMMddHHmmss')
            }

            await targetRef.withConverter(doc_converter<requestTable>()).update(set_req);
            console.log('SenderID ' + setID + ' was registerd.');
            return true;
        }
    }
    return false;
}

// function for getting sender ID
export async function getSenderIDs(target: string, targetDiffSec: number) {
    // get token from location document.
    const targetRef = db.collection('request').doc(target).withConverter(doc_converter<requestTable[]>());
    const doc = await targetRef.get();
    if (!doc.exists) {
        console.log('document ' + target + ' was not exist.');
    } else {
        const doclist = doc.data();
        if (doclist) {
            const ret: string[] = [];
            for (const req_item of doclist) {
                const req_time = req_item.reqDate;
                const convDate = date_fns.parse(req_time, 'yyyyMMddHHmmss', new Date());
                const nowDate = new Date();
                const diffSec = date_fns.differenceInSeconds(nowDate, convDate);
                if (diffSec <= targetDiffSec) {
                    ret.push(req_item.userID);
                }
            }

            // return sender ID array.
            return ret;
        }
    }
    return null;
}
