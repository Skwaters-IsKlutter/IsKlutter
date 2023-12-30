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

import SearchHeader from '../components/SearchHeader.js';
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
        return description.map((userData, index) => (
            <TouchableOpacity key={index} onPress={() => handleUsernameClick(userData.description)}>
                <View style={styles.userDataContainer}>
                    <Box bg="white" p={3} borderRadius={8} shadow={2} mb={3}>
                        <Text style={styles.username}>{userData.username}</Text>
                        <Text style={styles.description}>{userData.description}</Text>
                    </Box>
                </View>
</TouchableOpacity>
        ));
    };
    
    // Style definitions
    const styles = {
        userDataContainer: {
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#CCCCCC',
            paddingBottom: 10,
        },
        username: {
            fontWeight: 'bold',
            marginBottom: 5,
        },
        description: {
            fontStyle: 'italic',
            color: 'gray',
        },
    };
    
    
    
    

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeader posterUser="Sassa Girl" userIcon={require("../../assets/img/usericon.jpg")} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Community Label */}
                <VStack space="xs" pb={2}>
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Community</Heading>
                    <PostBox posterIcon={require("../../assets/img/usericon.jpg")} post={() => Alert.alert("Alert", "This is a dummy action")} />
                </VStack>

                {/*Community Posts Container */}
                <Box bg={colors.medium} borderRadius={8} p="$5" m={5} flex={1}>
                    <ScrollView>
                        <HStack space="xs" flexWrap="wrap" justifyContent="center">
                            {renderDescription()}


                        </HStack>
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    )
}