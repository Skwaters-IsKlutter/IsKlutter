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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Pressable } from 'react-native';

import { getFirestore, addDoc, collection, getDocs, query, where,  doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import IndividualPostCard from '../components/IndividualPostCard.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();



export default function IndividualPostPage() {
    const navigation = useNavigation();
    const route = useRoute();

    console.log('Route:', route);
    const selectedPost = route?.params?.selectedPost;
    console.log('Selected Post:', selectedPost);

    const postsData = selectedPost
    ? [
        {   
            username: selectedPost.username,
            description:selectedPost.description,
        },
    ]
    : [];

    const renderPosts = () => {
        console.log('Posts Data:', postsData);
        return postsData.map((userData, index) => 
          <IndividualPostCard
            key={index}
            username={userData.username}
            description={userData.description}
          />
        );
      };

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                <ScrollView>
                    <VStack space="xs" flexWrap="wrap">
                        {renderPosts()}
                    </VStack>

                    {/* Added a comment
                    <VStack space="xs">
                        <CommentBox posterIcon={ require("../../assets/img/usericon.jpg") } comment={() => Alert.alert("Alert", "This is a dummy action")} />
                    </VStack>
                     */}
                    {/* Replies
                    <VStack space="xs">
                        <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>Replies</Heading>
                        <VStack space="xs">
                            {renderListingsReply()}
                        </VStack>
                    </VStack> */}
                </ScrollView>
            </Box>
        </Box>
    );  
  

   
    // return ( 
    //     <Box w="100%" h="100%">
    //          <SearchHeaderBack></SearchHeaderBack>
    //         <Box>
    //             <ScrollView>
    //                 <HStack>
    //                     {renderCommunityPosts()}
    //                 </HStack>

    //             </ScrollView>
    //         </Box>

           

    //         <Heading>Hello</Heading>
    //     </Box>
    // )
}