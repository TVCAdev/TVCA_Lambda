"use strict";

import line from '@line/bot-sdk';

/**
 * LINE CHANNEL SECRET
 */
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

/**
 * LINE CHANNEL ACCESS TOKEN
 */
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export const line_config = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: LINE_CHANNEL_SECRET,
};

/*
 * LINE BOT client
 */
export const line_client = new line.Client(line_config);
