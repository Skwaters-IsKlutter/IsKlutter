import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCULJpR-bqcO3DntSpOxFhOjIElEKixkj0",
  authDomain: "isklutterdefensedb.firebaseapp.com",
  projectId: "isklutterdefensedb",
  storageBucket: "isklutterdefensedb.appspot.com",
  messagingSenderId: "719154538392",
  appId: "1:719154538392:web:7e05837b2ba5ff43036ded",
  measurementId: "G-E0WXBBWREG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage, storageRef, uploadBytes };