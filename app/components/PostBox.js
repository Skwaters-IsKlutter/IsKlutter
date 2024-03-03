// PostBox.js

import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Button, ButtonText, Input, InputField, Image } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

const generateRandomId = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
};

export default function PostBox({ post, userProfileImg }) {
  console.log("userProfileImg in PostBox", userProfileImg);
  const [listingDescription, setListingDescription] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth || !auth.currentUser) {
          setTimeout(fetchUserData, 1000);
          return;
        }

        const user = auth.currentUser;
        const userCollection = collection(db, 'users');
        const querySnapshot = await getDocs(query(userCollection, where('userID', '==', user.uid)));

        querySnapshot.forEach((doc) => {
          setUsername(doc.data().username);
        });
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const postForum = async () => {
    try {
      if (username) {
        const docRef = await addDoc(collection(db, 'forum'), {
          key: generateRandomId(),
          description: listingDescription,
          username: username,
        });

        setListingDescription('');
        alert('Posted');
        console.log('Document written with ID: ', docRef.id);
        console.log('Generated ID: ', docRef.id);
      } else {
        console.error('Username not fetched');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Box bgColor={colors.white} p={20}>
      <HStack space="sm" justifyContent="space-evenly" alignItems="center">
        <Image
          source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
          style={{ width: 50, height: 50, borderRadius: 25 }}
          alt = "user profile"
        />

        <Input bg={colors.white} borderColor={colors.secondary} h={75} w="65%" zIndex={0}>
          <InputField
            multiline={true}
            size="md"
            placeholder="Write a post..."
            value={listingDescription}
            onChangeText={(text) => setListingDescription(text)}
          />
        </Input>

        <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={50} onPress={postForum} ml={3}>
          <Text color={colors.white} fontSize="$sm">
            Post
          </Text>
        </Button>
      </HStack>
    </Box>
  );
}
