import React, { useEffect, useState, useCallback } from 'react';
import { Box, VStack, HStack, Text, Image, Pressable } from '@gluestack-ui/themed';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import colors from '../config/colors.js';

const db = getFirestore();

export default function PostCard({ userId, description, toIndividualPost, timestamp }) {
  
  const [username, setUsername] = useState('');
  const [userProfileImg, setUserProfileImg] = useState('');
  const isFocused = useIsFocused();
  
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
          borderRadius={5}
          width={370}
          ml={10}
          mt={10}
        >
          <HStack space="sm" alignItems="center" p={5} m={5}>
            <Image
              source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              alt="User Avatar"
            />
            <Text color={colors.secondary} size="md" bold={true}>
              {username}
            </Text>

            <Text color={colors.gray} size="xs" bold={true}>
              {timestamp}
            </Text>
          </HStack>

          <Text color="black" pb="$3" size="sm" ml="$3" mt={2}>
            {description}
          </Text>
        </Box>
      </VStack>
    </Pressable>
  );
}
