import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAl1jm8q5onXVIwWQI-OVLxviw9lpda2-A",
  authDomain: "isklutterfinal.firebaseapp.com",
  projectId: "isklutterfinal",
  storageBucket: "isklutterfinal.appspot.com",
  messagingSenderId: "1099286368526",
  appId: "1:1099286368526:web:1c8d4b34ae2c958b07875f",
  measurementId: "G-0B2GX1SR93"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);