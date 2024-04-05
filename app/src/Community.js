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
import { useNavigation } from '@react-navigation/native';
import { Alert, Pressable } from 'react-native';

import SearchHeader from '../components/SearchHeader.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
import { getFirestore, addDoc, collection, getDocs, query, where,  doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import UpperTabBar from '../components/UpperTabBar.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SearchHeaderBack from '../components/SearchHeaderBack.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const [usernames, setUsernames] = useState([]);
    const [description, setDescription] = useState([]);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState({}); // New state for comments
    const [username, setUsername] = useState('');


    const navigation = useNavigation();

    
    const addCommmunityComment = async (key, comment) => {
        try {
            const currentUser = username; 
            const userDocRef = await addDoc(collection(db, 'CommunityComment'), {
                username: currentUser,
                Primary: key,
                comment: comment
            });
            alert("Comment is posted");
            console.log('Document written with ID:', userDocRef.id);

        } catch (error) {
            console.error('Error adding document:', error);
            setError('Error creating user. Please try again.');
        }
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, 'forum');
                const querySnapshot = await getDocs(userCollection);
    
                const userData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const userDataObj = {
                        key: data.key, 
                        postusername: data.username, 
                        description: data.description,
                    };
                    userData.push(userDataObj);
                });
    
                setDescription(userData); 
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchData();
    }, []);
    
    

    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!auth || !auth.currentUser) {
                    setTimeout(fetchUserData, 1000);
                    return;
                }
    
                const currentUser = auth.currentUser; // Reference auth.currentUser
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(query(userCollection, where('userID', '==', currentUser.uid)));
    
                querySnapshot.forEach((doc) => {
                    setUsername(doc.data().username); // Assuming 'username' field exists in the user document
                });
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchUserData();
    }, []);
    

    useEffect(() => {
        const fetchComments = async () => {
            const commentsData = {};
            for (const userData of description) {
                try {
                    const commentQuery = query(
                        collection(db, 'CommunityComment'),
                        where('Primary', '==', userData.key)
                    );
                    const commentSnapshot = await getDocs(commentQuery);
                    const comments = [];
                    commentSnapshot.forEach((commentDoc) => {
                        const commentData = commentDoc.data();
                        comments.push({
                            username: commentData.username,
                            comment: commentData.comment
                        });
                    });
                    commentsData[userData.key] = comments;
                } catch (error) {
                    console.error('Error fetching comments:', error.message);
                    commentsData[userData.key] = [];
                }
            }
            setComments(commentsData);
        };
    
        fetchComments();
    }, [description]);
    

    
    
    const addComment = async (key, commentText) => {
        try {
          const userDocRef = doc(db, 'forum', key);
          const docSnap = await getDoc(userDocRef);
        
          if (docSnap.exists()) {
            await updateDoc(userDocRef, {
              comments: arrayUnion({ text: commentText, date: new Date() }),
            });
            fetchData();
          } else {
            console.error('Document does not exist');
          }
        } catch (error) {
          console.error('Error adding comment:', error.message);
        }
      };
      
      
    const renderAllCommunityPosts = () => {
        return description.map((userData, index) => 
            <PostCard
                key={index}
                posterIcon={userData.posterIcon}
                username={userData.postusername}
                // postDate={userData.postDate}
                description={userData.description}
                toIndividualPost={() => navigation.navigate(Routes.INDIVIDUALPOST, {selectedPost: userData })}
            />
        );
    }

    const initialCommentState = {};
    description.forEach(userData => {
        initialCommentState[userData.key] = ''; // Use a unique identifier as the key
    });

    const [commentTexts, setCommentTexts] = useState(initialCommentState);


    const renderDescription = () => {
        return description.map((userData, index) => (
            <Pressable key={index}> 
                <View style={styles.userDataContainer}>
                    <Box p={5} w="100%"  borderRadius={8}>
                        <Text style={styles.username}>{userData.postusername}</Text> 
                        <Text color={colors.secondary}size="xl" bold={true} style={styles.description}>{userData.username}</Text>
                        <Text fontSize="$md"style={styles.description}>{userData.description}</Text>
                        
                        <HStack>
                            <Input bg={colors.white} borderColor={colors.secondary} h={50} w="70%" zIndex={0}>
                                <InputField
                                    multiline={true}
                                    size="md"
                                    value={commentTexts[userData.comment]} // Use specific commentText based on user key
                                    placeholder="Comment."
                                    onChangeText={(text) => {
                                        setCommentTexts(prevState => ({
                                            ...prevState,
                                            [userData.key]: text // Update specific commentText based on user key
                                        }));
                                    }}                   
                                />
                            </Input>
                            <Button
                                variant="solid"
                                size="sm"
                                bg={colors.secondary}
                                borderRadius={8}
                                ml={3}
                                mt={5}
                                onPress={() => addCommmunityComment(userData.key, commentTexts[userData.key])}
                            >
                            <Text color={colors.white} fontSize="$sm">Comment</Text>
                            </Button>
                        </HStack>
                        
                        {/* Display comments with usernames */}
                        {comments[userData.key] && comments[userData.key].map((comment, commentIndex) => (
                            <Box key={commentIndex} mt={10} bgColor={colors.white} p={10}>
                                <HStack>
                                    {/* <UserAvatar></UserAvatar> */}
                                    <Text style={styles.username}>{comment.username}</Text>
                                </HStack>
                                <Text>{comment.comment}</Text>
                            </Box>
                        ))}
                    </Box>
                </View>
            </Pressable>
        ));
    };



return (
    // Parent box
    <Box w="100%" h="100%">

        <UpperTabBar 
            pageTitle={"Community"}
        />
        
        <ScrollView>
        <PostBox></PostBox>
            <VStack>
                {renderAllCommunityPosts()}
            </VStack>
        </ScrollView>



    </Box>
    )
}
