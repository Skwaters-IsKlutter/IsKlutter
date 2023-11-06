import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { Box, Text, } from '@gluestack-ui/themed'

export default function MessagesPage({ route }) {
    // const { otherUserEmail } = route.params;
    // const [messages, setMessages] = useState([]);
    // const navigation = useNavigation();

    // const user = {
    //     _id: auth?.currentUser?.email,
    //     avatar: 'https://i.pravatar.cc/300',
    // };

    // const chatRef = collection(database, 'privateChats', otherUserEmail);

    // const onSend = async (newMessages = []) => {
    //     const message = newMessages[0];
    //     try {
    //         const docRef = await addDoc(chatRef, {
    //             _id: message._id,
    //             text: message.text,
    //             createdAt: message.createdAt,
    //             user: {
    //                 _id: message.user._id,
    //                 name: auth?.currentUser?.displayName,
    //                 avatar: user.avatar,
    //             },
    //         });
    //         console.log('Message sent with ID: ', docRef.id);
    //     } catch (error) {
    //         console.error('Error sending message: ', error);
    //     }
    // };

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(
    //         query(chatRef, orderBy('createdAt', 'desc')),
    //         (querySnapshot) => {
    //             const newMessages = querySnapshot.docs.map((doc) => doc.data());
    //             setMessages(newMessages);
    //         }
    //     );

    //     return unsubscribe;
    // }, []);

    return (
        <Box>
            <Text>Messages</Text>
        </Box>
        // <View style={{ flex: 1 }}>
        //     <GiftedChat
        //         messages={messages}
        //         user={user}
        //         onSend={(newMessages) => onSend(newMessages)}
        //     />
        //     <TouchableOpacity
        //         onPress={() => navigation.goBack()}
        //         style={{
        //             position: 'absolute',
        //             top: 0,
        //             left: 10,
        //             padding: 10,
        //         }}
        //     >
        //         <Text style={{ color: 'blue' }}>Go Back</Text>
        //     </TouchableOpacity>
        // </View>
    );
}