require('dotenv').config();

import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

initializeApp({
  credential: applicationDefault(),
  storageBucket: process.env.STORAGE_BUCKET,
});

export const firestore = getFirestore();
export const storage = getStorage();
