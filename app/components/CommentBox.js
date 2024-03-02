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

import colors from '../config/colors.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CommentBox({ posterUserId, posterIcon, selectedItem }) {
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
        if (!selectedItem) {
            console.error('No selected item data provided');
            return;
        }
    
        // Get Firestore instance
        const firestore = getFirestore();
    
         // Add the comment to the Firestore collection
         try {
            const commentsCollectionRef = collection(firestore, 'ListingsComments');
            const newCommentDocRef = await addDoc(commentsCollectionRef, {
                itemId: selectedItem.id,
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
        <Box p="$2" bg={colors.white}>
            <Box w="100%" maxWidth="$60" pb="$2">
                <HStack space="sm" justifyContent="center" alignItems="center">
                    <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100} />
                    <Input bg={colors.white} borderColor={colors.secondary} h={80} w="75%">
                    <InputField
                        multiline={true}
                        size="md"
                        placeholder="Write a comment..."
                        value={commentText}  // Add this line to bind the value
                        onChangeText={(text) => setCommentText(text)}  // Add this line to update the state
                    />
                    </Input>
                </HStack>
            </Box>
            
            <VStack space="sm" p="$2" alignItems="right">
                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={50} onPress={handleComment}>
                    <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText>
                </Button>
            </VStack>
        </Box>
    )
}