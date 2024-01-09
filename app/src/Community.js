import React, { useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Text,
  Heading,
  Image,
  Box,
  ScrollView,
  Alert,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';

import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

import { FIREBASE_APP } from '../../config/firebase';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const [description, setDescription] = useState([]);
    const [comments, setComments] = useState({});
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');  // Add this line

    const navigation = useNavigation();

    const fetchUserData = async () => {
        try {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchUserData, 1000);
                return;
            }

            const currentUser = auth.currentUser;
            const userCollection = collection(db, 'users');
            const userQuery = query(userCollection, where('userID', '==', currentUser.uid));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot && querySnapshot.docs.length > 0) {
                const userDoc = querySnapshot.docs[0];
                setUserProfileImg(userDoc.data().userProfileImg);
            } else {
                console.error('User document not found for the current user.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useEffect(() => {
        // Set up Firebase listener for real-time updates
        const unsubscribe = onSnapshot(
            query(collection(db, 'forum')),
            (snapshot) => {
                const newPosts = snapshot.docs.map((doc) => ({
                    key: doc.id,
                    ...doc.data(),
                }));
                setDescription(newPosts);
            }
        );

        return () => {
            // Cleanup function to unsubscribe when the component unmounts
            unsubscribe();
        };
    }, []); // Empty dependency array to ensure it runs once on mount and cleans up on unmount

    useEffect(() => {
        fetchUserData();
        // You can add the call to fetchComments() here if needed
    }, []); // Dependency array depends on your specific dependencie

    const renderCommunityPosts = () => {
        return description.map((userData, index) => (
            console.log("Community img", userData.userProfileImg),
          <PostCard
            key={index}
            username={userData.username}
            
            description={userData.description}
            toIndividualPost={() =>
              navigation.navigate(Routes.INDIVIDUALPOST, {
                selectedPost: userData,
              })
            }
          />
        ));
      };

  console.log('userProfileImg', userProfileImg);

  return (
    <Box w="100%" h="100%">
      <SearchHeaderBack
        userIcon={require('../../assets/img/usericon.jpg')}
        back={navigation.goBack}
      />

      <Box width="100%">
        <VStack pb={2} bgColor={colors.secondary}>
          <Heading lineHeight={50} fontSize={30} color={colors.white} pl={20}>
            Community
          </Heading>
        </VStack>

        <PostBox
            posterIcon={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/usericon.jpg')}
            userProfileImg={userProfileImg}  // Add this line to pass userProfileImg as a prop
            //post={() => Alert.alert('Alert', 'This is a dummy action')}
        />

        <Box height="100%" bgColor={'$lightgray'}>
          <ScrollView width="100%">
            <HStack space="xs" flexWrap="wrap" alignItems="center">
              {renderCommunityPosts()}
            </HStack>
          </ScrollView>
        </Box>
      </Box>
    </Box>
  );
}
