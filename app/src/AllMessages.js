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
              if (messageData.recipient === loggedInUsername) {
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
            <View style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 25, 
              backgroundColor: 'lightblue', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: 5,
            }}>
              <Text>{username}</Text>
            </View>
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
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
                    Sender: {senderData.sender}
                  </Text>
                  <View>
                    {senderData.messages.map((message, msgIndex) => (
                      <View key={msgIndex} style={{ backgroundColor: 'white', padding: 10, marginVertical: 5 }}>
                        <Text>Message: {message}</Text>
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
      



    const messagesData = [
        { 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Sassa",
            senderUsername: "@sassagurl",
            message: "avail na po ang neon balls"
        }, { 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Yasmin Marie Asistido",
            senderUsername: "@kweenyasmin",
            message: "hahhahaha"
        }, { 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Juniper",
            senderUsername: "@leng",
            message: "mhine q"
        },{ 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Ychan",
            senderUsername: "@adele",
            message: "ayaw q na"
        },{ 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Ychan",
            senderUsername: "@adele",
            message: "hatdog"
        }
    ]

    const renderAllMessages = () => {
        return messagesData.map((message, index) =>
            <ReceivedMessageBox 
                key = {index}
                senderIcon={message.senderIcon}
                senderName={message.senderName}
                senderUsername={message.senderUsername}
                message={message.message}

            />
        );
    }

    return(
        // Parent box
        <Box w="100%" h="100%">
        
            {/*Search Bar*/}
            <SearchHeaderBack posterUser="Sassa Girl" 
            userIcon={require("../../assets/img/usericon.jpg")} />

            {/* Messages Title */}
            <VStack space="xs" alignItems="left" bgColor="$amber200" p="$3" width="100%">
                <Heading lineHeight={40} fontSize="$3xl" fontWeight="$extrabold" 
                    color={colors.secondary} m={2} >Messages</Heading>
            </VStack>

            {/* Container */}
            <Box p="$0" maxWidth="100%" flex={0} bgColor="#cfcfcf">
                <ScrollView>
                    <HStack space={0} flexWrap="wrap">
                                {renderUsernames()}
                                {renderSpecificMessage()}
                    

                    </HStack>
                </ScrollView> 
          </Box>
        </Box>
    )

}