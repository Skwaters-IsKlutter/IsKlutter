import { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                // Assuming your Firebase user document has a 'username' field
                // Replace 'users' with your actual Firebase collection name
                const userDocRef = database.collection('users').doc(user.uid);
                userDocRef.get()
                    .then((doc) => {
                        if (doc.exists) {
                            setUsername(doc.data().username);
                        } else {
                            console.log('No such document!');
                        }
                    })
                    .catch((error) => {
                        console.log('Error getting document:', error);
                    });
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