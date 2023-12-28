import React, { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    Box,
    VStack,
    Heading,
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function HelloCard() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('User UID:', user.uid);
          
                const userDocRef = collection(database, 'users');
                const userQuery = query(userDocRef, where('userID', '==', user.uid)); // Corrected 'uid' to 'userID'

                try {
                    const querySnapshot = await getDocs(userQuery);
                  
                    if (!querySnapshot.empty) {
                      const userDocument = querySnapshot.docs[0];
                      setUsername(userDocument.data().username);
                    } else {
                      console.log('No such document!');
                    }
                  } catch (error) {
                    console.error('Error getting document:', error);
                  }
            } else {
              setUsername(null);
            }
          });
    
        return () => {
            unsubscribe(); // Cleanup the subscription when the component unmounts
        };
    }, []);

    return (
        <Box p="$3" w="100%">
            <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>
                {username ? `Hello, ${username}!` : 'Loading...'}
            </Heading>
        </Box>
    );
}