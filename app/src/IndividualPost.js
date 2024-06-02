import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    HStack,
    Pressable
} from '@gluestack-ui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import colors from '../config/colors';
import IndividualPostCard from '../components/IndividualPostCard.js';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import CommunityReplyBox from '../components/CommunityReplyBox';

import fonts from '../config/fonts.js';
import { FIREBASE_APP } from '../../config/firebase';
import CommunityCommentBox from '../components/CommunityCommentBox';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function IndividualPostPage() {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPost } = route.params || {};
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log('Selected Post:', selectedPost);
        const fetchComments = async () => {
            try {
                const db = getFirestore(FIREBASE_APP); 
                const commentsRef = collection(db, 'CommunityComment');
                const postCommentsQuery = query(commentsRef, where('postKey', '==', selectedPost.key));
                const unsubscribe = onSnapshot(postCommentsQuery, (snapshot) => {
                    const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('Comments:', commentsData); 
                    setComments(commentsData);
                });
                // Return the unsubscribe function to clean up the listener when component unmounts
                return unsubscribe;
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
    
        if (selectedPost && selectedPost.key) {
            fetchComments();
        }
    }, [selectedPost]);

    // Render Specific Post
    const renderCommunityPosts = () => {
        return (
            <IndividualPostCard
                postKey={selectedPost.key}
                description={selectedPost.description}
                userId={selectedPost.userID}
                timestamp={selectedPost.timeposted?selectedPost.timeposted.toDate().toLocaleString():"N/A"}
            />
        );
    };

    // Render Comments
    const renderComments = () => {
        const sortedComments = comments.slice().sort((a, b) => b.timestamp - a.timestamp);
        return sortedComments.map(comment => (
            <CommunityReplyBox
                key={comment.commentID}
                replyUserID={comment.commentUserID}
                replyComment={comment.comment}
                timestamp={comment.timestamp ? comment.timestamp.toDate().toLocaleString() : "N/A"}
            />
        ));
    };


    return (
        <Box w="100%" h="100%">
           <Box w="100%" maxHeight={150} bg={colors.primary}>
           <VStack>
                <HStack p="$3" w="100%" mt={25} alignItems="center">
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                </HStack>
            </VStack>
        </Box>
            <Box p="$3" w="100%" flex={1} h="100%">
                <VStack>
                    <ScrollView h="85%">
                        <VStack space="xs" p="$1">
                            {renderCommunityPosts()}
                        </VStack>

                        {/* Render comments */}
                        <VStack mt={10}>
                            <Text fontFamily="Poppins_600SemiBold">
                                <Heading  fontSize={20} color={colors.primary}>Comments</Heading>
                            </Text>
                                {renderComments()}
                        </VStack>
                    </ScrollView>
                </VStack>
            
            </Box>
            {/* Comment Box */}
            <VStack size="md" top={-100} p="$3">
                <CommunityCommentBox 
                    posterUserId={selectedPost.userID}
                    selectedPost={selectedPost} 
                />  
                </VStack>
        </Box> 
    );
}
