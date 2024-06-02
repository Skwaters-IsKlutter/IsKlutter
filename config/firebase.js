import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCme7gwMsGiiaflf4X6Sm6hIyrHBHoCDNM",
  authDomain: "isklutterfinaldb.firebaseapp.com",
  projectId: "isklutterfinaldb",
  storageBucket: "isklutterfinaldb.appspot.com",
  messagingSenderId: "570201752762",
  appId: "1:570201752762:web:a8239c48cfba6896fbee83",
  measurementId: "G-WNQTGPT3EH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage, storageRef, uploadBytes };