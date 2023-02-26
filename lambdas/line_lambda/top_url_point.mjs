"use strict";

import express from 'express';
const app = express();

import line_msg_handle from './line_msg_handle.mjs';
import where_are_you_handle from './where_are_you_handle.mjs';

line_msg_handle(app);
where_are_you_handle(app);

export default app;
