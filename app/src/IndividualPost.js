import React, { useState, useEffect } from 'react';
import { View, Button, Image, useWindowDimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    VStack,
    Heading,
    Box,
    Text,
    ScrollView,
    HStack,
    Pressable
} from '@gluestack-ui/themed';

import { getFirestore, collection, getDoc, query, where, onSnapshot, doc, } from 'firebase/firestore'; // Import onSnapshot

import IndividualPostCard from '../components/IndividualPostCard.js';
import CommunityReplyBox from '../components/CommunityReplyBox';
import CommunityCommentBox from '../components/CommunityCommentBox';
import BackHeader from '../components/BackHeader.js';

import fonts from '../config/fonts.js';
import colors from '../config/colors.js';

export default function IndividualPostPage() {
    const { width: screenWidth } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPost } = route.params || {};
    const [comments, setComments] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const db = getFirestore();
                const commentsRef = collection(db, 'CommunityComment');
                const postCommentsQuery = query(commentsRef, where('postKey', '==', selectedPost.key));
                const unsubscribe = onSnapshot(postCommentsQuery, (snapshot) => {
                    const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setComments(commentsData);
                });
                return unsubscribe;
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchImageUrls = async () => {
            try {
                const db = getFirestore();
                const postDoc = doc(db, 'forum', selectedPost.key);
                const postSnap = await getDoc(postDoc);
                if (postSnap.exists()) {
                    const post = postSnap.data();
                    console.log('Post:', post);
                    setImageUrls(post.images);
                    console.log('Image URLs:', imageUrls);
                } else {
                    console.error('Post not found');
                }
            } catch (error) {
                console.error('Error fetching image URLs:', error);
            }
        };

        if (selectedPost && selectedPost.key) {
            fetchComments();
            fetchImageUrls();
        }
    }, [selectedPost]);

    // Render Specific Post
    const renderCommunityPosts = () => {
        if (imageUrls.length > 0) {
            return (
                
                <><IndividualPostCard
                    postKey={selectedPost.key}
                    description={selectedPost.description}
                    userId={selectedPost.userID}
                    timestamp={selectedPost.timeposted ? selectedPost.timeposted.toDate().toLocaleString() : "N/A"} /><ScrollView horizontal>
                        {/* Map through imageUrls array and render each image with its caption */}
                        {imageUrls.map((imageUrl, index) => (
                            <View key={index} style={{ alignItems: 'center', marginRight: 20 }}>
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={{ width: screenWidth - 40, height: 200, marginBottom: 10 }} // Adjust dimensions as needed
                                />
                            </View>
                        ))}
                    </ScrollView></>
            );
        } else {
            return (
                <IndividualPostCard
                    postKey={selectedPost.key}
                    description={selectedPost.description}
                    userId={selectedPost.userID}
                    timestamp={selectedPost.timeposted ? selectedPost.timeposted.toDate().toLocaleString() : "N/A"}
                />
            );
        }
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
           <BackHeader />
            <Box p="$3" w="100%" flex={1} h="100%">
                <VStack>
                    <ScrollView h="85%">
                        <VStack space="xs" p="$1">
                            {renderCommunityPosts()}
                        </VStack>

                        {/* Render comments */}
                        <VStack mt={10}>
                            <Text fontFamily={fonts.bold} color={colors.primary} fontSize="$xl">Comments</Text>
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
