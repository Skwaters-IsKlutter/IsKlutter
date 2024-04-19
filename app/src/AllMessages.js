import React, { useEffect, useState } from 'react';
import {
    VStack,
    View,
    HStack,
    Text,
    Heading,
    Box,
    Button,
    ButtonText,
    FormControl,
    Input,
    InputField,
    ScrollView,
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ReceivedMessageBox from '../components/ReceivedMessageBox.js';

import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Routes from '../components/constants/Routes.js';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserAvatar from '../components/Avatar.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();


export default function AllMessagesPage( { user } ) {

    const navigation = useNavigation();
    const [usernames, setUsernames] = useState([]);
    const [messages, setMessages] = useState([]);
    const [sender, setSender] = useState([]);
    

    useEffect(() => {
        const fetchAllUsernames = async () => {
            try {   
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(userCollection);
    
                const allUsernames = [];
                querySnapshot.forEach((doc) => {
                    allUsernames.push(doc.data().username);
                });
    
                setUsernames(allUsernames); // Set usernames to state
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
    
                setSender(allSender); // Set usernames to state
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
      
            const senderMessagesMap = {}; // Object to store messages grouped by sender
      
            messagesSnapshot.forEach((doc) => {
              const messageData = doc.data();
              if (messageData.recipient === loggedInUsername || messageData.sender === loggedInUsername) {
                const sender = messageData.sender;
                const message = messageData.message;
      
                if (!senderMessagesMap[sender]) {
                  senderMessagesMap[sender] = {
                    sender: sender,
                    messages: [], // Initialize the array for the sender's messages
                  };
                }
      
                senderMessagesMap[sender].messages.push(message); // Push the message to the sender's array
              }
            });
      
            const filteredMessages = Object.values(senderMessagesMap); // Convert senderMessagesMap into an array
      
            setMessages(filteredMessages); // Set filtered messages to state
          } catch (error) {
            console.error('Error fetching data:', error.message);
          }
        };
      
        fetchSenderandMessage();
      }, [auth]);
    
      const renderUsernames = () => {
        return usernames.map((username, index) => (
              <TouchableOpacity key={index} onPress={() => handleUsernameClick(username)}>
                <ScrollView>
                <VStack width={380} backgroundColor={colors.white}  m={5}>
                    <View style={{ 
                      // width: 50, 
                      // height: 50, 
                      // borderRadius: 25, 
                      // backgroundColor: 'lightblue', 
                      justifyContent: 'center',
                      fontSize: 10,
                      margin: 5,
                      padding:10
                    }}>
                      <HStack>
                        <UserAvatar></UserAvatar>
                        <Text p={10}>{username}</Text>
                      </HStack>
                    </View>
                  </VStack>
                </ScrollView>
              </TouchableOpacity>
             
        ));
      };
      
      const renderSender = () => {
        return sender.map((senderName, index) => (
          <TouchableOpacity key={index} onPress={() => handleUsernameClick(senderName)}>
            <View style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 25, 
              backgroundColor: 'lightblue', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: 5,
            }}>
              <Text>{senderName}</Text>
            </View>
          </TouchableOpacity>
        ));
      };
      
      const renderSpecificMessage = () => {
        return (
          <View>
            {messages.map((senderData, index) => (
              <TouchableOpacity key={index} onPress={() => handleUsernameClick(senderData.sender)}>
                <View style={{ backgroundColor: 'white', borderRadius: 9, padding: 10, marginVertical: 5, w: '100%'}}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5, marginBottom: 5 }}>
                    {senderData.sender}
                  </Text>
                  <View>
                    {senderData.messages.map((message, msgIndex) => (
                      <View key={msgIndex}>
                        <Text>{message}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      };
      
      const handleUsernameClick = (selectedUsername) => {
        navigation.navigate(Routes.PRIVATEMESSAGE, { recipient: selectedUsername });
      };

   

    return(
        // Parent box
        <Box w="100%" h="100%">
        
            {/*Search Bar*/}
            <SearchHeaderBack />

            {/* Messages Title */}
            <VStack space="xs" alignItems="left" p="$3" width="100%">
                <Heading lineHeight={40} fontSize="$3xl" fontWeight="$extrabold" 
                    color={colors.secondary} m={2} >Messages</Heading>
            </VStack>

            {/* Container */}
            <Box p="$2" maxWidth="100%" flex={0} >


              <ScrollView>
                    <HStack space="xs" flexWrap="wrap">
                                {renderUsernames()} 
                                {/* {renderSpecificMessage()} */}
                    </HStack>
                </ScrollView>  
          </Box>
        </Box>
    )
}