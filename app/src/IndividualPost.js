import React, { useEffect, useState } from 'react';
import {
    VStack,
    HStack,
    Text,
    Heading,
    Image,
    Box,
    Button,
    ButtonText,
    FormControl,
    Input,
    InputField,
    View,
    ScrollView
} from '@gluestack-ui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Pressable } from 'react-native';

import { getFirestore, addDoc, collection, getDocs, query, where,  doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import IndividualPostCard from '../components/IndividualPostCard.js';
import CommunityCommentBox from '../components/CommunityCommentBox.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();



export default function IndividualPostPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const username = route?.params?.username; // Retrieve the username from route params
    const selectedPost = route?.params?.selectedPost;
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserProfileImg, setCurrentUserProfileImg] = useState('');
    const [postComments, setPostComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Add the useEffect hook to fetch the current user's profile image
    useEffect(() => {
        const auth = getAuth();
        const firestore = getFirestore();  // Corrected line

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userCollectionRef = collection(firestore, 'users');  // Corrected line
                const userQuery = query(userCollectionRef, where('userID', '==', user.uid));
                setCurrentUser(user);
                
                try {
                    const userQuerySnapshot = await getDocs(userQuery);

                    if (!userQuerySnapshot.empty && userQuerySnapshot.docs[0]) {
                        const userDocument = userQuerySnapshot.docs[0];
                        const userProfileImg = userDocument.data().userProfileImg || '';
                        setCurrentUserProfileImg(userProfileImg);
                    } else {
                        setCurrentUserProfileImg('');
                        console.error(`User document not found for uid: ${user.uid}`);
                    }
                } catch (error) {
                    setCurrentUserProfileImg('');
                    console.error('Error fetching user document:', error);
                }
            } else {
                setCurrentUserProfileImg('');
            }
        });

        return () => {
            if (typeof unsubscribeAuth === 'function') {
                unsubscribeAuth();
            }
        };
    }, []); // Empty dependency array to run effect only once

     // Function to fetch listing comments from Firestore
     const fetchPostComments = async () => {
        console.log('Fetching comments for listing ID:', selectedPost.id);
        const firestore = getFirestore();
    
        const commentsCollectionRef = collection(firestore, 'CommunityComments');
        const postCommentsQuery = query(commentsCollectionRef, where('postId', '==', selectedPost.id));
    
        try {
            const postCommentsSnapshot = await getDocs(postCommentsQuery);
    
            if (!postCommentsSnapshot.empty) {
                const commentsData = postCommentsSnapshot.docs.map((commentDoc) => commentDoc.data());
                console.log('Fetched comments:', commentsData);
                setPostComments(commentsData);
            } else {
                console.log('No comments found.');
                setPostComments([]);
            }
    
            // Set up the listener for real-time updates
            const unsubscribeListener = setupCommentsListener();
    
            // Clean up the listener when the component is unmounted or selectedItem changes
            return () => {
                unsubscribeListener();
            };
        } catch (error) {
            console.error('Error fetching post comments:', error);
        }
    };

    // Function to set up a Firestore listener for listing comments
    const setupCommentsListener = () => {
    const firestore = getFirestore();
    const commentsCollectionRef = collection(firestore, 'Co');
    const postCommentsQuery = query(commentsCollectionRef, where('postId', '==', selectedPost.id));

    const unsubscribe = onSnapshot(postCommentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map((commentDoc) => commentDoc.data());
        console.log('Updated comments:', commentsData);
        setPostComments(commentsData);
    });

    return unsubscribe;
};

    // UseEffect to fetch listing comments when selectedPostchanges
    useEffect(() => {
        if (selectedPost && selectedPost.id) {
            // Initial fetch
            fetchPostComments();
        }
    }, [selectedPost]);
    

    // Function to add a new comment
    const addComment = async () => {
        const firestore = getFirestore();

        try {
            const newCommentRef = await addDoc(collection(firestore, 'forum'), {
                postId: selectedPost.id,
                userId: currentUser.uid,
                comment: newComment,
                timestamp: serverTimestamp(),
            });

            console.log('New comment added with ID:', newCommentRef.id);

            // Update the local state with the new comment
            setPostComments((prevComments) => [
                ...prevComments,
                {
                    userId: currentUser.uid,
                    comment: newComment,
                    timestamp: new Date(),
                },
            ]);

            // Clear the input field after adding the comment
            setNewComment('');
        } catch (error) {
            console.error('Error adding new comment:', error);
        }
    };

    console.log('Route:', route);
    console.log('Selected Post:', selectedPost);

    const postsData = selectedPost
    ? [
        {   
            username: selectedPost.username,
            description:selectedPost.description,
        },
    ]
    : [];

    const renderPosts = () => {
        console.log('Posts Data:', postsData);
        return postsData.map((userData, index) => 
            <IndividualPostCard
            key={index}
            username={username} // Pass the retrieved username to IndividualPostCard
            description={userData.description}
        />
        );
      };

      const renderPostComments = () => {
        return postComments.map((comment, index) => (
          <ReplyBox
            key={index}
            replyUser={comment.userId}  // Assuming userId is the user ID for the comment
            //userIcon={comment.userIcon}  // Assuming userIcon is the user's profile image
            replyText={comment.comment}
            replyDate={comment.timestamp ? comment.timestamp.toDate().toLocaleDateString() : 'N/A'}
            replyTime={comment.timestamp ? comment.timestamp.toDate().toLocaleTimeString() : 'N/A'}
          />
        ));
      };

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

    
            <Box p="$6" w="100%" maxWidth="$96" flex={1} h="100%">
                    <ScrollView>
                        <VStack space="xs">
                        
                            {renderPosts()}
                        </VStack>

                    <VStack space="xs">
                    <CommunityCommentBox
                        selectedPost={selectedPost}
                        posterUserId={currentUser ? currentUser.uid : null}
                        posterIcon={currentUserProfileImg ? { uri: currentUserProfileImg } : require("../../assets/img/usericon.jpg")}
                        onCommentChange={(comment) => setNewComment(comment)}  // Added callback to update new comment
                        onAddComment={addComment}  // Added callback to add new comment
                    />
                    </VStack>
               
                
                    {/* Listing Comments */}
                    <VStack space="xs">
                        <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>Comments</Heading>
                        <VStack space="xs">
                            {renderPostComments()}
                        </VStack>
                    </VStack>
                

                    {/* Added a comment
                    <VStack space="xs">
                        {/* <CommentBox posterIcon={ require("../../assets/img/usericon.jpg") } comment={() => Alert.alert("Alert", "This is a dummy action")} /> */}
                    {/* </VStack> */}
                     
                    {/* Replies */}
                    {/* <VStack space="xs">
                        <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>Replies</Heading>
                        <VStack space="xs">
                            {/* {renderListingsReply()} */}
                        {/* </VStack> */}
                    {/* </VStack> */} 
                </ScrollView> 

            </Box>
          </Box>  
       
    );  
                }

   
    /* // return ( 
    //     <Box w="100%" h="100%">
    //          <SearchHeaderBack></SearchHeaderBack>
    //         <Box>
    //             <ScrollView>
    //                 <HStack>
    //                     {renderCommunityPosts()}
    //                 </HStack>

    //             </ScrollView>
    //         </Box>

           

    //         <Heading>Hello</Heading>
    //     </Box>
    // )
} */