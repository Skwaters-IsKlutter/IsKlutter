import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Image,
    Button,
    ButtonText,
    Input,
    InputField,
} from '@gluestack-ui/themed';

import UserAvatar from './Avatar.js';
import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function PostBox({ post, posterUser, posterIcon }) {
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
            setUsername(doc.data().username); // Assuming 'username' field exists in the user document
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
          // Add data to Firestore collection 'forum'
          const docRef = await addDoc(collection(db, 'forum'), {
            description: listingDescription,
            username: username,
          });
  
          // Clear input fields after posting
          setListingDescription('');
          alert('Posted');
          console.log('Document written with ID: ', docRef.id);
        } else {
          // Handle case where username is not fetched yet
          console.error('Username not fetched');
        }
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    };

    return (
        <Box m={10}>
            <HStack space="lg" justifyContent="space-evenly" alignItems="center">
                <UserAvatar username={posterUser} userIcon={posterIcon} />

                <Input bg={colors.white} borderColor={colors.secondary} h={75} w="72%" zIndex={0}>
                    <InputField
                        multiline={true}
                        size="md"
                        placeholder="Write a post..."
                        value={listingDescription}
                        onChangeText={(text) => setListingDescription(text)}
                    />
                </Input>

                <Button
                    variant="solid"
                    size="sm"
                    bg={colors.secondary}
                    borderRadius={8}
                    onPress={postForum}
                    ml={3}
                >
                    <Text color={colors.white} fontSize="$sm">Post</Text>
                </Button>
            </HStack>
        </Box>
    );
}