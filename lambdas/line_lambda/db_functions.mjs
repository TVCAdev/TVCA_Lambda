"use strict";

import { initializeApp, cert } from'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/*
 * Initialize Firebase
 */
initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
});

export const db = getFirestore();

export default db;
