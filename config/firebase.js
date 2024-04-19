import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDrcqUw30yuHuUc0wDiB2xd--YvFkSIV9Q",
  authDomain: "isklutterfirebase.firebaseapp.com",
  projectId: "isklutterfirebase",
  storageBucket: "isklutterfirebase.appspot.com",
  messagingSenderId: "442462941859",
  appId: "1:442462941859:web:99102ff81ef333801a8516",
  measurementId: "G-KKS642S9J4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage, storageRef, uploadBytes };