import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text,
    Image,
    Pressable
} from '@gluestack-ui/themed';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import colors from '../config/colors.js';

export default function CommunityReplyBox({ replyUserID, replyComment }) {
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = getFirestore();
                const usersRef = collection(db, 'users');
                const userQuery = query(usersRef, where('userID', '==', replyUserID));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setUsername(userData.username);
                    setUserProfileImg(userData.userProfileImg);
                } else {
                    console.error('User document not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [replyUserID, replyComment]); 

    return (
        <Box p="$3" w="100%" backgroundColor="$white" mt={10} borderRadius={10}>
            <VStack>
                <HStack space="sm" alignItems="center">
                    <Image
                        source={{ uri: userProfileImg || 'default_profile_image_url' }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="User Avatar"
                    />
                    <Heading color={colors.secondary} size="sm" bold={true}>
                        {username}
                    </Heading>
                </HStack>
                <Text color="black" pb="$3" size="md" mt="$3">
                    {replyComment}
                </Text>
            </VStack>
        </Box>
    );
}
