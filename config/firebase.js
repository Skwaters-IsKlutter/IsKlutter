import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB06gBwn5TGuMxRvOaJqNP243Dx8s7Ypcw",
    authDomain: "isklutter-44ba8.firebaseapp.com",
    projectId: "isklutter-44ba8",
    storageBucket: "isklutter-44ba8.appspot.com",
    messagingSenderId: "143228769830",
    appId: "1:143228769830:web:11afc342107ba446f0f8e7",
    measurementId: "G-3Z2FB4TZS9"
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();