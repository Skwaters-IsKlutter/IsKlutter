import { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import {
    Box,
    VStack,
    Heading,
} from '@gluestack-ui/themed';

import TagLabel from '../components/TagLabel.js';
import colors from '../config/colors.js';

export default function HelloCard() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // User is signed in
                const userDocRef = doc(database, 'users', user.uid); // search and compare id
                try {
                    const docSnapshot = await getDoc(userDocRef);
                    if (docSnapshot.exists()) {
                        setUsername(docSnapshot.data().username);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error getting document:', error);
                }
            } else {
                // No user is signed in
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