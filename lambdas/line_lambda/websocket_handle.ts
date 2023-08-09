'use strict';

import express from 'express';

/**
 * set websocket handler function.
 */
async function websocket_handle(app: express.Express) {
    /*
     * function is called when websocket session.
     */
    app.post(
        '/websoket',
        express.json(),
        async (req: express.Request, res: express.Response) => {
            console.log('WEBSOCKET called...');
            console.log(req);

            res.status(200).end();
        },
    );
}

export default websocket_handle;
