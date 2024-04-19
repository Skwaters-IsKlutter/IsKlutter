import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxkOdC6HIzGg6ci5R8sA5CqDDRYPj3SmI",
  authDomain: "isklutterdb.firebaseapp.com",
  projectId: "isklutterdb",
  storageBucket: "isklutterdb.appspot.com",
  messagingSenderId: "17672508121",
  appId: "1:17672508121:web:3187971cf58c66e3bbe4c8",
  measurementId: "G-ETWQ6PKHYC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage, storageRef, uploadBytes };