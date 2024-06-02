import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Image,
} from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

export default function CommunityReplyBox({ replyUserID, replyComment, timestamp }) {
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const isFocused = useIsFocused();

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

        if (isFocused) { // Check if the component is focused
            fetchUserData();
        }
    }, [replyUserID, isFocused]); // Add isFocused to the dependency array

    return (
        <Box p="$3" w="100%" backgroundColor="$white" mt={10} borderRadius={10}>
            <VStack>
                <HStack space="sm" alignItems="center">
                    <Image
                        source={{ uri: userProfileImg || 'default_profile_image_url' }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="User Avatar"
                    />
                    <Text color={colors.secondary} size="md" fontFamily={fonts.semibold}>
                        {username}
                    </Text>
                    <Text color={colors.black} size="xs" fontFamily={fonts.regular}>
                    {timestamp}
                    </Text>
                </HStack>
                <Text color="black" pb="$3" size="md" mt="$3" fontFamily={fonts.regular}  >
                    {replyComment}
                </Text>
            </VStack>
        </Box>
    );
}