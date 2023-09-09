'use strict';

import express from 'express';
import db, { doc_converter, configLocationTable } from './db_functions.js';
import { getSenderIDs } from './tools_functions.js';
import { line_client } from './line_functions.js';
/**
 * FUNCTION FOR CHECKING CAMERADATA URL TOKEN AUTHENTICATION
 */
const check_camera_data_url_token = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.query.url_token !== undefined && req.query.url_token == process.env.CAMERA_DATA_URL_TOKEN) {
        next();
    } else {
        res.status(401).end();
    }
};

/**
 * set line handler function.
 */
async function camera_data_handle(app: express.Express) {
    /*
     * function is called when line require camera data.
     */
    app.post(
        '/' + process.env.CAMERA_DATA_LOCATION_URL,
        express.json(),
        check_camera_data_url_token,
        async (req: express.Request, res: express.Response) => {
            console.log('CAMERA_DATA_LOCATION_URL called...');

            // case of request came data
            if (req.query.type != undefined && (req.query.type == "livcam" || req.query.type == "entcam")) {

                // get document from firebase
                const targetRef = db.doc('request/get' + req.query.type);
                // get camdata in firebase as field camdata
                try {
                    const doc = await targetRef.get();
                    if (doc.exists) {
                        const camdata = doc.data()?.camdata;
                        if (camdata !== undefined) {
                            // convert camera data from base64 to binary
                            const camdata_binary = Buffer.from(camdata, 'base64');

                            //response camera data
                            res.status(200).send(camdata_binary);
                        } else {
                            res.status(404).end();
                        }
                    } else {
                        res.status(404).end();
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).end();
                }
            }
        },
    );
}

export default camera_data_handle;
