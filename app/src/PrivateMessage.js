import React, { useEffect, useState } from 'react';
import {
    VStack,
    HStack,
    Text,
    Box,
    Button,
    ButtonText,
    View,
    FormControl,
    Input,
    InputField,
    ScrollView,
    Image
} from '@gluestack-ui/themed';
import { Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import UserAvatar from '../components/Avatar.js';
import SenderBox from '../components/SenderBox.js';

import { getFirestore, addDoc, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import Routes from '../components/constants/Routes.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function PrivateMessagePage() {
    const route = useRoute();
    const recipient = route.params?.recipient || '';
    const userProfileImg = route.params?.userProfileImg || ''; 
    const [username, setUsername] = useState('');
    const navigation = useNavigation();
    const [messageContent, setMessageContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null); // State to track selected message

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!auth || !auth.currentUser) {
                    setTimeout(fetchUserData, 1000);
                    return;
                }

                const user = auth.currentUser;
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(query(userCollection, where('userID', '==', user.uid)));

                querySnapshot.forEach((doc) => {
                    setUsername(doc.data().username); 
                });
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const sendMessage = async () => {
        try {
            if (recipient && messageContent) {
                const timestamp = serverTimestamp(); 

                const messageData = {
                    sender: username,
                    recipient: recipient,
                    message: messageContent,
                    timestamp: timestamp, 
                };

                const docRef = await addDoc(collection(db, 'Messages'), messageData);
                
                setMessages(prevMessages => [...prevMessages, {
                    id: docRef.id, // Store the document ID
                    sender: username,
                    message: messageContent,
                    currentUserSent: true 
                }]);

                setMessageContent('');
                console.log('Document written with ID: ', docRef.id);
            } else {
                console.error('Recipient or message content missing');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!auth || !auth.currentUser || !recipient) {
                    return;
                }

                const user = auth.currentUser;
                const loggedInUsername = username;

                const messagesCollection = collection(db, 'Messages');
                const messagesSnapshot = await getDocs(messagesCollection);

                const filteredMessages = [];

                messagesSnapshot.forEach((doc) => {
                    const messageData = doc.data();
                    const sender = messageData.sender;
                    const currentRecipient = messageData.recipient;
                    const message = messageData.message;
                    const timestamp = messageData.timestamp; 

                    const currentUserSent = sender === loggedInUsername && currentRecipient === recipient;
                    const recipientSent = sender === recipient && currentRecipient === loggedInUsername;

                    if (currentUserSent || recipientSent) {
                        filteredMessages.push({
                            id: doc.id, // Store the document ID
                            sender: sender,
                            message: message,
                            currentUserSent: currentUserSent, 
                            timestamp: timestamp 
                        });
                    }
                });

                const sortedMessages = filteredMessages.sort((a, b) => a.timestamp - b.timestamp);

                setMessages(sortedMessages); 
            } catch (error) {
                console.error('Error fetching messages:', error.message);
            }
        };

        fetchMessages();
    }, [auth, recipient, username]);

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteDoc(doc(db, 'Messages', messageId));
            setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
            setSelectedMessage(null);
        } catch (error) {
            console.error('Error deleting message: ', error);
        }
    };

    const renderSpecificMessage = () => {
        if (!messages || messages.length === 0) {
            return null; 
        }

        const loggedInUser = username;

        return (
            <View style={{ flexWrap: 'wrap', width: "100%" }}>
                {messages.map((messageData, index) => (
                    <View
                        key={messageData.id}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: messageData.currentUserSent ? 'flex-end' : 'flex-start',
                            width: "100%",
                            marginBottom: 10,
                        }}
                    >
                        <HStack>
                            {!messageData.currentUserSent && (
                                <Image
                                    source={{ uri: userProfileImg }}
                                    h={45}
                                    w={45}
                                    alt="icon"
                                    borderRadius={100}
                                    style={{ marginRight: 10, marginTop: 10 }}
                                />
                            )}
                            <TouchableOpacity onPress={() => setSelectedMessage(messageData.id)}>
                                <View
                                    style={{
                                        backgroundColor: messageData.currentUserSent ? '#285656' : 'white',
                                        padding: 10,
                                        marginVertical: 5,
                                        flexShrink: 1,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Text color={messageData.currentUserSent ? 'white' : 'black'} fontFamily={fonts.regular}>
                                        {messageData.message.trim()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {selectedMessage === messageData.id && (
                                <Button
                                    onPress={() => handleDeleteMessage(messageData.id)}
                                    variant="solid"
                                    size="sm"
                                    bg={colors.primary}
                                    borderRadius={50}
                                    m={10}
                                >
                                    <Text color={colors.white} fontSize="$sm">Delete</Text>
                                </Button>
                            )}
                        </HStack>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <Box w="100%" h="100%">
            <SenderBox recipientName={recipient} back={navigation.goBack} />
            <Box h="75%" width="100%" flex={1}>
                <ScrollView>
                    <HStack space={0} flexWrap="wrap" m={10}>
                        {renderSpecificMessage()}
                    </HStack>
                </ScrollView>
            </Box>
            <HStack m={20} alignContent='center' justifyContent='space-between' alignItems='center'>
                <Input bg={colors.white} borderColor={colors.secondary} h={50} w="80%" borderRadius={15}>
                    <InputField
                        multiline={true}
                        size="sm"
                        placeholder="Chat here..."
                        value={messageContent}
                        onChangeText={(text) => setMessageContent(text)}
                        fontFamily={fonts.regular}
                    />
                </Input>
                <Button
                    variant="solid"
                    size="sm"
                    bg={colors.primary}
                    borderRadius={50}
                    onPress={sendMessage}
                    m={10}
                >
                    <ButtonText color={colors.white} fontSize="$sm" fontFamily={fonts.semibold}>Send</ButtonText>
                </Button>
            </HStack>
        </Box>
    );
}
