import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
} from '@gluestack-ui/themed';

import colors from '../config/colors';
import SearchHeaderBack from '../components/SearchHeaderBack';
import IndividualPostCard from '../components/IndividualPostCard.js';
import { getFirestore, collection, getDocs,query,where } from 'firebase/firestore';
import CommunityReplyBox from '../components/CommunityReplyBox';


import { FIREBASE_APP } from '../../config/firebase';
import CommunityCommentBox from '../components/CommunityCommentBox';
// import CommunityReplyBox from '../components/CommunityReplyBox';

export default function IndividualPostPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPost } = route.params || {};
    const [comments, setComments] = useState([]);

    
    useEffect(() => {
        console.log('Selected Post:', selectedPost);
        // Fetch comments for the specific post from Firebase when component mounts
        const fetchComments = async () => {
            try {
                const db = getFirestore(FIREBASE_APP); 
                const commentsRef = collection(db, 'CommunityComment');
                const postCommentsQuery = query(commentsRef, where('Primary', '==', selectedPost.key));
                const querySnapshot = await getDocs(postCommentsQuery);
                const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Comments:', commentsData); 
                setComments(commentsData);
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
                description={selectedPost.description}
                userId={selectedPost.userID}
            />
        );
    };

    // Render Comments
    const renderComments = () => {
        return comments.map(comment => (
            <CommunityReplyBox
                key={comment.id}
                replyUsername={comment.username}
                replyComment={comment.comment}
            />
      
        ));
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} back={navigation.goBack} />
            <Box p="$3" w="100%" flex={1} h="100%">
                <ScrollView>
                    <VStack space="xs" p="$1">
                        {renderCommunityPosts()}
                    </VStack>

                    {/* Comment Box */}
                    <VStack>
                        <CommunityCommentBox></CommunityCommentBox>        
                    </VStack>

                    {/* Render comments */}
                    <VStack mt={10}>
                        <Heading  fontSize={20} color={colors.primary}>Comments</Heading>
                            {renderComments()}
                    </VStack>
                            
                </ScrollView>
            </Box>
        </Box>
    );
}