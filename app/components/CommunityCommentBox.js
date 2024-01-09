import React, { useState } from 'react';
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

export default function CommunityCommentBox( {posterUserId, posterIcon, selectedPost} ) {
    
    const [commentText, setCommentText] = useState('');

    const handleComment = async () => {
        // Check if posterUserId is not null
        if (!posterUserId) {
            console.error('Invalid user ID: null');
            // Handle the case where the user ID is not available
            // For example, you could show an error message to the user
            return;
        }

        // Check if selectedItem is available
        if (!selectedPost) {
            console.error('No selected item data provided');
            return;
        }
    
        // Get Firestore instance
        const firestore = getFirestore();
    
         // Add the comment to the Firestore collection
         try {
            const commentsCollectionRef = collection(firestore, 'PostComments');
            const newCommentDocRef = await addDoc(commentsCollectionRef, {
                itemId: selectedPost.id,
                userId: posterUserId,
                comment: commentText,
                timestamp: serverTimestamp(),
            });
    
            // Log the new comment document reference for debugging
            console.log('New comment added with ID: ', newCommentDocRef.id);

            // Clear the comment text after submitting
            setCommentText('');

        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };
    
    return (
        <Box bg={colors.white}>
            <Box w="$64" flex={1}>
                <HStack space="md" justifyContent="space-evenly" p={2} alignItems="center">
                    {/* <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100} /> */}
                    {/* <UserAvatar username={posterUser} userIcon={posterIcon} /> */}

                    <Input bg={colors.white} borderColor={colors.secondary} h={40} w="100%">
                        <InputField multiline={true} 
                            size="md" 
                            placeholder="Write a comment..." 
                            value={commentText}
                            onChangeText={(text) => setCommentText(text)} 
                            />
                    </Input>
                </HStack>

                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={8} onPress={handleComment} mt={10} w="40%" alignSelf="flex-end">
                    <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}