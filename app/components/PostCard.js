import React, { useEffect, useState, useCallback } from 'react';
import { Box, VStack, HStack, Text, Image, Pressable } from '@gluestack-ui/themed';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

// import usePoppinsFonts from '../config/fonts.js/index.js';

const db = getFirestore();

export default function PostCard({ userId, description, toIndividualPost, timestamp }) {
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const isFocused = useIsFocused();

    // const { bold } = usePoppinsFonts();

    const fetchUserData = useCallback(async () => {
        try {
            const userCollection = collection(db, 'users');
            const userQuery = query(userCollection, where('userID', '==', userId));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                setUsername(userData.username);
                setUserProfileImg(userData.userProfileImg);
            } else {
                setUsername('User not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            setUsername('Error fetching user data');
        }
    }, [userId]);

    useEffect(() => {
        if (isFocused) {
            console.log('Focusing Post Card');
            fetchUserData();
        }
    }, [isFocused, fetchUserData]);

    return (
        <Pressable onPress={toIndividualPost}>
            <VStack>
                <Box
                    backgroundColor={colors.white}
                    borderRadius={10}
                    width={380}
                    maxHeight={300}
                    m={5}
                    pb={3}
                    overflow="hidden"

                >
                    <HStack space="sm" alignItems="center" p="$3" m={5}>
                        <Image
                            source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                            alt="User Avatar"
                        />
                        <VStack>
                            <Text color={colors.secondary} size="lg" fontFamily={fonts.semibold}>
                                {username}
                            </Text>

                            <Text color={colors.black} size="xs" fontFamily={fonts.regular}>
                                {timestamp}
                            </Text>
                        </VStack>
                    </HStack>

                    <VStack size="md">
                        <Text color="black" pb="$3" size="lg" ml="$3" mr={50} textAlign='justify' ellipsizeMode='tail' numberOfLines={7} fontFamily={fonts.semibold}>
                            {description}
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Pressable>
    );
}