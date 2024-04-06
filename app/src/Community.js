import React, { useState } from 'react';
import { Box, VStack, ScrollView } from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import UpperTabBar from '../components/UpperTabBar.js';
import Routes from '../components/constants/Routes.js';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const [description, setDescription] = useState([]);
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

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
    };

    return (
        <Box w="100%" h="100%">
            <UpperTabBar
                pageTitle={"Community"}
            />
            <ScrollView>
                <PostBox />
                <VStack>
                    {renderAllCommunityPosts()}
                </VStack>
            </ScrollView>
        </Box>
    );
}
