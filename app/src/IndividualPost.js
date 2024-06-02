import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, TouchableOpacity, Modal } from 'react-native'; // Import Modal from react-native
import { useRoute, useNavigation } from '@react-navigation/native';
import {
    VStack,
    Box,
    Text,
    ScrollView,
    Button,
    ButtonText,
    Center
} from '@gluestack-ui/themed';

import { getFirestore, collection, getDoc, query, where, onSnapshot, doc } from 'firebase/firestore'; // Import onSnapshot

import IndividualPostCard from '../components/IndividualPostCard.js';
import CommunityReplyBox from '../components/CommunityReplyBox';
import CommunityCommentBox from '../components/CommunityCommentBox';
import BackHeader from '../components/BackHeader.js';

import fonts from '../config/fonts.js';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function IndividualPostPage() {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedPost } = route.params || {};
    const [comments, setComments] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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
                    setImageUrls(post.images || []);
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

    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    // Render Specific Post
    const renderCommunityPosts = () => {
        if (imageUrls.length > 0) {
            return (
                <>
                    <IndividualPostCard
                        postKey={selectedPost.key}
                        description={selectedPost.description}
                        userId={selectedPost.userID}
                        timestamp={selectedPost.timeposted ? selectedPost.timeposted.toDate().toLocaleString() : "N/A"}
                    />
                    <Center>
                        {imageUrls.map((imageUrl, index) => (
                            <TouchableOpacity key={index} onPress={() => openModal(imageUrl)}>
                                <View style={{ alignItems: 'center', marginRight: 20 }}>
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={{ width: screenWidth, height: screenWidth / 1.5, marginBottom: 5 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Center>
                </>
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
                {/* Comment Box */}
            <VStack size="md"  p="$2">
                <CommunityCommentBox 
                    posterUserId={selectedPost.userID}
                    selectedPost={selectedPost} 
                />  
            </VStack>
            </Box>

            

            {/* Image Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ width: screenWidth, height: screenHeight / 2 }}
                        resizeMode="contain"
                    />
                    <Button onPress={closeModal} m={5} bg={colors.primary}>
                        <ButtonText fontFamily={fonts.semibold}>Back</ButtonText>
                    </Button>
                </View>
            </Modal>
        </Box> 
    );
}
