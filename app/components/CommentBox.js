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
        if (!commentText.trim()) {
            console.error('Comment is empty');
            return;
        }
        if (!posterUserId) {
            console.error('Invalid user ID: null');
            return;
        }
        if (!selectedItem) {
            console.error('No selected item data provided');
            return;
        }
    
        const firestore = getFirestore();

         try {
            const commentsCollectionRef = collection(firestore, 'ListingsComments');
            const newCommentDocRef = await addDoc(commentsCollectionRef, {
                itemId: selectedItem.id,
                userId: posterUserId,
                comment: commentText,
                timestamp: serverTimestamp(),
            });
            console.log('New comment added with ID: ', newCommentDocRef.id);
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
                        value={commentText}
                        onChangeText={(text) => setCommentText(text)} 
                    />
                    </Input>
                </HStack>
            </Box>
            
            <VStack space="sm" p="$2" alignItems="right">
                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={10} onPress={handleComment}>
                    <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText>
                </Button>
            </VStack>
        </Box>
    )
}
