import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Button, Input, InputField, Image } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, updateDoc } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function PostBox({ onPostSubmit }) {
    const [listingDescription, setListingDescription] = useState('');
    const [username, setUsername] = useState('');

    const postForum = async () => {
        try {
            if (!auth || !auth.currentUser) {
                console.error('User not authenticated');
                return;
            }
        
            const user = auth.currentUser;
            const userID = user.uid;
            
            if (!userID) {
                console.error('User ID not available');
                return;
            }
        
            if (listingDescription) {
                const docRef = await addDoc(collection(db, 'forum'), {
                    userID: userID,
                    description: listingDescription,
                    timestamp: new Date(),
                    key: '', 
                  });

                await updateDoc(docRef, { key: docRef.id });
                setListingDescription('');
                alert('Posted');
            } else {
                console.error('Listing description is empty');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <Box bgColor={colors.white} p={20}>
            <HStack space="sm" justifyContent="space-evenly" alignItems="center">
                <Image
                    source={require('../../assets/img/profile-holder.jpg')}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    alt="user profile"
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
