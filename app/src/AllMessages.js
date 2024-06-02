import React, { useEffect, useState } from 'react';
import {
    VStack,
    View,
    Text,
    Heading,
    Box,
    HStack,
    ScrollView,
    Image
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import UserAvatar from '../components/Avatar.js';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import Routes from '../components/constants/Routes.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function AllMessagesPage({ user }) {
    const navigation = useNavigation();
    const [usernames, setUsernames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [sender, setSender] = useState([]);
    const [userProfileImgs, setUserProfileImgs] = useState([]);


    useEffect(() => {
        const fetchAllUsernames = async () => {
            try {
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(userCollection);

                const allUsernames = [];
                const allUserProfileImgs = []; // Array to store profile image URLs

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    allUsernames.push(userData.username);
                    allUserProfileImgs.push(userData.userProfileImg); // Pushing the userProfileImg URL to the array
                });

                setUsernames(allUsernames);
                setUserProfileImgs(allUserProfileImgs); // Setting the state for profile image URLs
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchAllUsernames();
    }, []);


    useEffect(() => {
        const fetchAllsender = async () => {
            try {
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(userCollection);

                const allSender = [];
                querySnapshot.forEach((doc) => {
                    allSender.push(doc.data().sender);
                });

                setSender(allSender);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchAllsender();
    }, []);

    useEffect(() => {
        const fetchSenderandMessage = async () => {
            try {
                if (!auth || !auth.currentUser) {
                    setTimeout(fetchUserData, 1000);
                    return;
                }

                const user = auth.currentUser;
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(query(userCollection, where('userID', '==', user.uid)));

                let loggedInUsername = null;

                querySnapshot.forEach((doc) => {
                    loggedInUsername = doc.data().username;
                });

                const messagesCollection = collection(db, 'Messages');
                const messagesSnapshot = await getDocs(messagesCollection);

                const senderMessagesMap = {};

                messagesSnapshot.forEach((doc) => {
                    const messageData = doc.data();
                    if (messageData.recipient === loggedInUsername || messageData.sender === loggedInUsername) {
                        const sender = messageData.sender;
                        const message = messageData.message;

                        if (!senderMessagesMap[sender]) {
                            senderMessagesMap[sender] = {
                                sender: sender,
                                messages: [],
                            };
                        }

                        senderMessagesMap[sender].messages.push(message);
                    }
                });

                const filteredMessages = Object.values(senderMessagesMap);

                setMessages(filteredMessages);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchSenderandMessage();
    }, [auth]);

    const handleUsernameClick = (selectedUsername, selectedUserProfileImg) => {
        navigation.navigate(Routes.PRIVATEMESSAGE, { recipient: selectedUsername, userProfileImg: selectedUserProfileImg })
    };

    const handleSearchChange = (text) => {
        setSearchInput(text.toLowerCase());
    };

    const renderUsernames = () => {
        return usernames.map((username, index) => (
            <TouchableOpacity key={index} onPress={() => handleUsernameClick(username, userProfileImgs[index])}>
                <ScrollView>
                    <VStack width={380} backgroundColor={colors.white} m={5}>
                        <View style={{ justifyContent: 'center', fontSize: 10, margin: 5, padding: 5 }}>
                            <HStack>
                                {userProfileImgs[index] && typeof userProfileImgs[index] === 'string' ? (
                                    <Image
                                        source={{ uri: userProfileImgs[index] }}
                                        h={50}
                                        w={50}
                                        alt="icon"
                                        borderRadius={100}
                                    />
                                ) : (
                                    <UserAvatar /> // Render a placeholder or default avatar component
                                )}
                                <Text p={10} fontFamily={fonts.semibold} lineHeight={30}>{username}</Text>
                            </HStack>
                        </View>
                    </VStack>
                </ScrollView>
            </TouchableOpacity>
        ));
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeaderBack
                userIcon={require('../../assets/img/usericon.jpg')}
                placeholder="Search in listings"
                onSearchChange={handleSearchChange}
            />
            <VStack space="xs" alignItems="left" p="$3" width="100%">
                <Text lineHeight={50} fontSize={40} color={colors.secondary} fontFamily={fonts.semibold} letterSpacing={-1}>
                    Messages
                </Text>
            </VStack>
            <Box p="$2" maxWidth="100%" flex={0}>
                <ScrollView>
                    <VStack space="xs" flexWrap="wrap">
                        {renderUsernames()}
                    </VStack>
                </ScrollView>
            </Box>
        </Box>
    );
}