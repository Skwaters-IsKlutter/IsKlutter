import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

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

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage, storageRef, uploadBytes };