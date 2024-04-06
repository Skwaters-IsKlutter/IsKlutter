import React, { useEffect, useState, useCallback } from 'react';
import { Box, VStack, HStack, Text, Image, Pressable } from '@gluestack-ui/themed';
import { getFirestore, collection, doc, getDoc, userDoc, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

import colors from '../config/colors.js';

const db = getFirestore();

export default function PostCard({ userId, userProfileImg, description, toIndividualPost }) {
  const [username, setUsername] = useState('');
  const isFocused = useIsFocused();
  
  const fetchUsername = useCallback(async () => {
    try {
      const userCollection = collection(db, 'users');
      const userQuery = query(userCollection, where('userID', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setUsername(userData.username);
      } else {
        setUsername('User not found');
      }
    } catch (error) {
      console.error('Error fetching username:', error.message);
      setUsername('Error fetching username');
    }
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      console.log('Focusing Post Card');
      fetchUsername();
    }
  }, [isFocused, fetchUsername]);

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
          </HStack>

          <Text color="black" pb="$3" size="sm" ml="$3" mt={2}>
            {description}
          </Text>
        </Box>
      </VStack>
    </Pressable>
  );
}
