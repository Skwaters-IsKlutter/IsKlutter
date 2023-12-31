import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database, firestore } from '../../config/firebase'; // Update the path as needed
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfileImg, setUserProfileImg] = useState(/* default value or null */);

  useEffect(() => {
    // Listen for changes in authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, fetch the profile image from Firestore
        const { uid } = user;
  
        const userDocRef = query(collection(database, 'users'), where('userID', '==', uid));
        getDocs(userDocRef).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // Assuming there's only one document with the given UID
            const doc = querySnapshot.docs[0];
            const userData = doc.data();
            // Update the profile image in the state
            setUserProfileImg(userData.userProfileImg); // Assuming 'profileImage' is the field in Firestore
          } else {
            console.error('User document not found.');
          }
        });
      } else {
        // User is signed out, set the profile image to null or default
        setUserProfileImg(/* default value or null */);
      }
    });
  
    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const updateUserProfileImg = (img) => {
    setUserProfileImg(img);
    console.log('Updated user profile image UserIcon: ', img);
  };

  return (
    <UserContext.Provider value={{ userProfileImg, updateUserProfileImg }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
