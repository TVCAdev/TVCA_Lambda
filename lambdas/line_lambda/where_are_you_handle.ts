'use strict';

import express from 'express';
import db, { doc_converter, configLocationTable } from './db_functions.js';
import { getSenderIDs } from './tools_functions.js';
import { line_client } from './line_functions.js';
/**
 * FUNCTION FOR CHECKING WHERE_ARE_YOU URL TOKEN AUTHENTICATION
 */
const check_where_are_you_url_token = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.query.url_token !== undefined && req.query.url_token == process.env.WHERE_ARE_YOU_URL_TOKEN) {
        next();
    } else {
        res.status(401).end();
    }
};

/**
 * set line handler function.
 */
async function where_are_you_handle(app: express.Express) {
    /*
     * function is called when father's smartphone sended location information.
     */
    app.post(
        '/' + process.env.WHERE_ARE_YOU_LOCATION_URL,
        express.json(),
        check_where_are_you_url_token,
        async (req: express.Request, res: express.Response) => {
            console.log('LOCATION_URL called...');

            // case of register token
            if ('token' in req.body && req.body.token != null) {
                // register token to firebase cloud firestore
                const locRef = db.collection('config').doc('location').withConverter(doc_converter<configLocationTable>());

                try {
                    await locRef.set({ token: req.body.token });
                    console.log('registering token was succeed.');
                }
                catch (error) {
                    console.log('registering token was failed...:', error);
                };
            }
            // case of response getting location
            else if (
                'latitude' in req.body &&
                'longitude' in req.body &&
                req.body.latitude != null &&
                req.body.longitude != null
            ) {
                console.log(
                    `reply of GET_LOCATION was received. latitude:${req.body.latitude} longitude: ${req.body.longitude}.`,
                );

                // push api message
                const senderIDs = await getSenderIDs('getlocation', 30);

                if (senderIDs == null) {
                    console.log('No senderIDs...');
                    res.status(200).end();
                }
                else {
                    console.log('senderIDs data:', senderIDs);

                    for (const senderID of senderIDs) {
                        await line_client.pushMessage(senderID, {
                            type: 'location',
                            title: 'パパの現在地',
                            address: 'パパの現在地',
                            latitude: req.body.latitude,
                            longitude: req.body.longitude,
                        });
                    }
                }
            } else {
                console.log('json data was not set...');
            }

            res.status(200).end();
        },
    );
}

export default where_are_you_handle;
