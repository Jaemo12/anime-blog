// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyD10iaqzGO_joOuLpGC7Ke6YTVkHqpgBb8",
    authDomain: "animefanfic-2b8ee.firebaseapp.com",
    projectId: "animefanfic-2b8ee",
    storageBucket: "animefanfic-2b8ee.firebasestorage.app",
    messagingSenderId: "1096584913266",
    appId: "1:1096584913266:web:e8b0d0f7086563ec237deb"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };