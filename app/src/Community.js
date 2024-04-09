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
                timestamp={userData.timeposted ? userData.timeposted.toDate().toLocaleString() : "N/A"}
                toIndividualPost={() => navigation.navigate(Routes.INDIVIDUALPOST, { selectedPost: userData })}
            />
        ));
    }
    

    const initialCommentState = {};
    description.forEach(userData => {
        initialCommentState[userData.key] = ''; // Use a unique identifier as the key
    });


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
                    <Heading lineHeight={40} fontSize={40} color={colors.secondary}>
                        Community
                    </Heading>
                    
                    <ScrollView height="95%">
                        <PostBox />
                        <VStack>{renderAllCommunityPosts()}</VStack>
                    </ScrollView>
                </VStack>
            </Box>
        </Box>
    )
}

