import React, { useState } from 'react';
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
import { Alert } from 'react-native';

import { getFirestore, collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../components/UserIcon.js';


// Define the CommunityCommentBox component
export default function CommunityCommentBox({ posterUserId, selectedPost }) {
    const [commentText, setCommentText] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const { userProfileImg } = useUser();

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserId = currentUser ? currentUser.uid : null;

    const handleComment = async () => {
        if (!posterUserId || !selectedPost || !commentText) { // Check if comment text is empty
            console.error('Invalid user ID, selected post, or empty comment');
            return;
        }

        setIsLoading(true); // Set loading state to true

        const firestore = getFirestore();
        const commentsCollectionRef = collection(firestore, 'CommunityComment');
        
        try {
            const newCommentDocRef = doc(commentsCollectionRef);
            await addDoc(commentsCollectionRef, {
                postKey: selectedPost.key,
                posterID: posterUserId,
                commentUserID: currentUserId,
                comment: commentText,
                commentID: newCommentDocRef.id,
                timestamp: serverTimestamp(),
            });

            console.log('Comment added successfully');
            setCommentText('');
            // setShowSuccessPopup(true);
            Alert.alert("Success", "Comment added successfully.");

            // Close the success popup after 2 seconds
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 2000);
        } catch (error) {
            console.error('Error adding comment: ', error);
        } finally {
            setIsLoading(false); // Set loading state to false regardless of success or error
        }
    };
    
    return (
        <Box p="$3">
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
                    fontFamily={fonts.regular}
                    
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
        // <Box>
        //     <Box flex={1}>
        //         <HStack space="md" justifyContent="space-evenly" p={2} alignItems="center" mt={20}>
        //             <Input bg={colors.white} borderColor={colors.secondary} h={50} w="100%" borderRadius={30} multiline={true}>
        //                 <InputField multiline={true} 
        //                     size="md" 
        //                     placeholder="Write a comment..." 
        //                     value={commentText}
        //                     onChangeText={(text) => setCommentText(text)} 
        //                     fontFamily={fonts.regular}
        //                     />
        //             </Input>
        //         </HStack>

        //         <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={50} onPress={handleComment} mt={30} w="30%" alignSelf="flex-end">
        //             {isLoading ? (
        //                 <ButtonText color={colors.white} fontSize="$sm" fontFamily={fonts.bold}>Loading</ButtonText>
        //             ) : (
        //                 <ButtonText color={colors.white} fontSize="$sm" fontFamily={fonts.bold}>Comment</ButtonText>
        //             )}
        //         </Button>
        //     </Box>
        //     {/* Success Popup
        //     {showSuccessPopup && (
        //         <Box position="absolute" bottom={20} right={20} bg="green" p={3} borderRadius={10}>
        //             <Text color="white">Comment added successfully!</Text>
        //         </Box>
        //     )} */}
        // </Box>
    // )
}
