import React, { useEffect, useState } from 'react';
import {
    VStack,
    HStack,
    Text,
    Box,
    Button,
    Input,
    InputField,
    View,
    ScrollView,
    Heading
} from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import { Alert, Pressable } from 'react-native';

import { getFirestore, addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import SearchHeader from '../components/SearchHeader.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
// import { TouchableOpacity } from 'react-native';
// import UpperTabBar from '../components/UpperTabBar.js';
// import SearchHeaderBack from '../components/SearchHeaderBack.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const navigation = useNavigation();
    const [usernames, setUsernames] = useState([]);
    const [description, setDescription] = useState([]);
    const [username, setUsername] = useState('');

    const fetchUserData = async () => {
        try {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchUserData, 1000);
                return;
            }
            const currentUser = auth.currentUser;
            const userCollection = collection(db, 'users');
            const querySnapshot = await getDocs(query(userCollection, where('userID', '==', currentUser.uid)));
            querySnapshot.forEach((doc) => {
                setUsername(doc.data().username);

            });
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const fetchAllCommunityPosts = async () => {
        try {
            const userCollection = collection(db, 'forum');
            const querySnapshot = await getDocs(userCollection);
            const userData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const userDataObj = {
                    key: doc.id,
                    description: data.description,
                    userID: data.userID,
                    timeposted: data.timestamp,
                };
                userData.push(userDataObj);
            });
            setDescription(userData);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useFocusEffect(() => {
        fetchUserData();
        fetchAllCommunityPosts();
    });

    const renderAllCommunityPosts = () => {
        return description.map((userData, index) => (

            <PostCard
                key={index}
                userId={userData.userID}
                posterIcon={userData.userProfileImg}
                description={userData.description}
                toIndividualPost={() => navigation.navigate(Routes.INDIVIDUALPOST, { selectedPost: userData })}
            />

        ));
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
                    <Box p={5} w="100%" borderRadius={8}>
                        <Text style={styles.username}>{userData.postusername}</Text>
                        <Text color={colors.secondary} size="xl" bold={true} style={styles.description}>{userData.username}</Text>
                        <Text fontSize="$md" style={styles.description}>{userData.description}</Text>

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

            <SearchHeader
                userIcon={require('../../assets/img/usericon.jpg')}
                placeholder="Search in community"
            // search={searchInput}
            // onSearchChange={handleSearchChange}
            />

            <Box p="$5" w="100%" maxWidth="$96" flex={1}>
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={50} fontSize={40} color={colors.secondary}>
                        Community
                    </Heading>

                    <ScrollView>
                        <PostBox />
                        <VStack>{renderAllCommunityPosts()}</VStack>
                    </ScrollView>
                </VStack>
            </Box>
        </Box>
    )
}

