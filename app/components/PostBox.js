import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, HStack, Button, Input, InputField, Image } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import { useUser } from '../components/UserIcon.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function PostBox() {
    const [listingDescription, setListingDescription] = useState('');
    const { userProfileImg } = useUser();

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

                setListingDescription('');
                await updateDoc(docRef, { key: docRef.id });
                alert('Success', 'Post added successfully');
                console.log("Post added successfully");
            } else {
                console.error('Listing description is empty');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <Box>
            <VStack space="sm" justifyContent="space-evenly" alignItems="center" p="$3">
                {userProfileImg && (
                    <Image
                        source={{ uri: userProfileImg }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="user profile"
                    />
                )}

                <Input bg={colors.white} borderColor={colors.secondary} h="70%" w="100%" zIndex={0}>
                    <InputField
                        multiline={true}
                        size="md"
                        placeholder="Write a post..."
                        value={listingDescription}
                        onChangeText={(text) => setListingDescription(text)}
                    />
                </Input>

                
            </VStack>
            <VStack p="$3">
            <Button variant="solid" 
                    size="sm" 
                    bg={colors.secondary} 
                    borderRadius={30} 
                    onPress={postForum} ml={3}>
                    <Text color={colors.white} fontSize="$sm">
                        Post
                    </Text>
                </Button>
            </VStack>
        </Box>
    );
}
