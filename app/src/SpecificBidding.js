// React components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

// Gluestack-ui components
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    HStack,
    Pressable
} from '@gluestack-ui/themed';

// Local components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';
import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';

// Firebase components
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, database, getFirestore, onSnapshot } from 'firebase/firestore';


export default function SpecificBiddingPage() {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        // Parent box
        <Box w="100%" h="100%">
            <Box bgColor={colors.primary} w="100%" h="12%">
                <HStack p="$2" w="100%" mt={30} ml={10} alignItems="center" >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} />
                    </Pressable>
                </HStack>  

            </Box>

            {/* Image  */}
            <Box bgColor='$black' w="100%" h="30%">
                

            </Box>
            
            
            
        </Box>
    );
}