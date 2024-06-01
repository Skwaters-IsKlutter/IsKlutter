import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Header,
    Input,
    InputField,
    InputSlot,
    InputIcon,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    Pressable,
    Image
} from '@gluestack-ui/themed';
import { useNavigation,  useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../components/UserIcon.js';
import colors from '../config/colors.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CommentBox({ posterUserId, selectedItem }) {
    const [commentText, setCommentText] = useState('');
    const { userProfileImg } = useUser();

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
        <Box p="$3" bg={colors.white}>
            <Box w="100%" >
                <HStack space="sm" justifyContent="center" alignItems="center">
                    <Image source={userProfileImg} h={45} w={45} alt="icon" borderRadius={100} />
                    <Input bg={colors.white} borderColor={colors.secondary} h={50} w="75%" borderRadius={50}>
                    <InputField
                        multiline={true}
                        size="sm"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChangeText={(text) => setCommentText(text)} 
                        
                    />
                    </Input>
                    <Pressable onPress={handleComment}>
                        <MaterialCommunityIcons name="send" color={colors.primary} size={30} p={5} />
                    </Pressable>
                    {/* <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={10} onPress={handleComment}> */}
                    {/* <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText> */}
                {/* </Button> */}
                </HStack>
            </Box>
        </Box>
    )
}
