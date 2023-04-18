'use strict';

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore, WithFieldValue, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

/*
 * Initialize Firebase
 */
initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
});

export const doc_converter = <T>() => ({
    toFirestore: (data: WithFieldValue<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export interface stateInRoomTable {
    inState: boolean;
}

export interface requestTable {
    userID: string;
    reqDate: string;
}

export interface configLocationTable {
    token: string;
}

export interface logInroomLogsTable {
    action: string;
    date: Timestamp;
    name: string;
}

export const db: Firestore = getFirestore();

export default db;
