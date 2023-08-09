'use strict';

import express from 'express';
const app: express.Express = express();

import line_msg_handle from './line_msg_handle.js';
import where_are_you_handle from './where_are_you_handle.js';
import websocket_handle from './websocket_handle.js';

line_msg_handle(app);
where_are_you_handle(app);
websocket_handle(app);

export default app;
