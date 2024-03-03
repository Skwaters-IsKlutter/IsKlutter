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
import CommunityCommentBox from '../components/CommunityCommentBox.js';
import ReplyBox from '../components/ReplyBox.js';


const db = getFirestore(FIREBASE_APP);
const auth = getAuth();



export default function IndividualPostPage() {
    const navigation = useNavigation();
    const route = useRoute();
  
    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

    
            <Box p="$3" w="100%" flex={1} h="100%">
                <VStack space="xs" p="$1">
                    <IndividualPostCard></IndividualPostCard>
                    <CommunityCommentBox></CommunityCommentBox>

                    <Heading top={100} fontSize={20} color={colors.primary}>Comments</Heading>

                </VStack>

            </Box>
        </Box>
    )
}