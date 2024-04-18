// React components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';


// Gluestack-ui components
import { HStack, VStack, Heading, Text, Box, 
    ScrollView,Input,InputField,InputSlot,
    InputIcon, Button, ButtonIcon, ButtonText,Pressable } from '@gluestack-ui/themed';


// Local components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';
import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';

// Firebase Components
import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();



export default function AllBidderListCard({bidder, biddingPrice}) {
    const navigation = useNavigation();
    const route = useRoute();

    return(
        <Box bg={colors.white} p={10} m={5}>
            <HStack justifyContent="space-between" alignItems="center">
                <Text bold="true" color={colors.black}>{bidder}</Text>
                <Text bold="true" color={colors.secondary}>PHP {biddingPrice}</Text>
            </HStack>
        </Box>

    )

   
}