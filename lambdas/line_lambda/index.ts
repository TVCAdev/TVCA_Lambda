'use strict';

import serverlessExpress from '@vendia/serverless-express';
import app from './top_url_point.js';

export const lineHandler = serverlessExpress({ app });
