import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Heading, Text, Image } from '@gluestack-ui/themed';
import { getFirestore, collection, doc, getDoc, userDoc, query, where, getDocs } from 'firebase/firestore';
import UserAvatar from './Avatar.js';
import colors from '../config/colors.js';

const database = getFirestore();

export default function IndividualPostCard({ userId, description }) {
    const [username, setUsername] = useState('');
    console.log('user ID:', userId);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const userCollection = collection(database, 'users');
                const userQuery = query(userCollection, where('userID', '==', userId));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setUsername(userData.username);
                } else {
                    console.error('User document not found');
                }
            } catch (error) {
                console.error('Error fetching username:', error.message);
            }
        };
    
        fetchUsername();
    }, [userId]);
    

    return (
        <Box p="$3" w="100%" backgroundColor="$white">
            <VStack>
                <HStack space="sm" alignItems="center">
                    <UserAvatar />
                    <Heading color={colors.primary} size={10} bold={true}>
                        {username}
                    </Heading>
                </HStack>
                <Text color="black" pb="$3" size="md" mt="$3">
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}
