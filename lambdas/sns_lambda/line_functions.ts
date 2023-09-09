'use strict';

import line from '@line/bot-sdk';

/**
 * LINE CHANNEL SECRET
 */
const LINE_CHANNEL_SECRET: string = process.env.LINE_CHANNEL_SECRET || '';

/**
 * LINE CHANNEL ACCESS TOKEN
 */
const LINE_CHANNEL_ACCESS_TOKEN: string = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

export const line_client_config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: LINE_CHANNEL_SECRET,
};

export const line_middle_config: line.MiddlewareConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: LINE_CHANNEL_SECRET,
};

/*
 * LINE BOT client
 */
export const line_client: line.Client = new line.Client(line_client_config);
