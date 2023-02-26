"use strict";

import serverlessExpress from '@vendia/serverless-express';
import app from './top_url_point.mjs';


export const handler = serverlessExpress({ app });
