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
import { Alert } from 'react-native';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const [usernames, setUsernames] = useState([]);
    const [description, setDescription] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, 'forum');
                const querySnapshot = await getDocs(userCollection);
    
                const userData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const userDataObj = {
                        username: data.username,
                        description: data.description
                    };
                    userData.push(userDataObj);
                });
    
                setDescription(userData); // Set usernames and descriptions to state
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchData();
    }, []);
    
    const communityData = [
        { 
            posterIcon: require("../../assets/img/sassa.jpg"),
            posterName: "Sassa",
            postDate: "11/20/2023",
            postContent: "avail na po ang neon balls"
        }, { 
            posterIcon: require("../../assets/img/usericon.jpg"),
            posterName: "Rawr",
            postDate: "11/19/2023",
            postContent: "Hello."
        }, {
            posterIcon: require("../../assets/img/sassa.jpg"),
            posterName: "Sassa",
            postDate: "11/17/2023",
            postContent: "sapaka niyo ko b"
        }
        
    ]

    const renderCommunityPosts = () => {
        return communityData.map((post, index) => 
            <PostCard
                key={index}
                posterIcon={post.posterIcon}
                posterName={post.posterName}
                postDate={post.postDate}
                postContent={post.postContent}
            />
        );
    }

    const renderDescription = () => {
        return description.map((userData, index) => 
            <PostCard
                key={index}
                username={userData.username}
                description={userData.description}
            />
        );
    }

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeaderBack 
                    posterUser="Sassa Girl"
                    userIcon={ require("../../assets/img/usericon.jpg") } 
                    back={navigation.goBack} 
                />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Community Label */}
                <VStack space="xs" pb={2}>
                    <Heading lineHeight={40} fontSize="$4xl" color={colors.secondary}>Community</Heading>
                    <PostBox posterIcon={require("../../assets/img/usericon.jpg")} post={() => Alert.alert("Alert", "This is a dummy action")} />
                </VStack>

                {/*Community Posts Container */}
                <Box bg={colors.medium} borderRadius={8} p="$5" m={5} flex={1}>
                    <ScrollView>
                        <HStack space="xs" flexWrap="wrap" justifyContent="center" >
                            {renderDescription()}
                        </HStack>
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    )
}