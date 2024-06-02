import React, { useState, useEffect }  from 'react';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    Button,
    ButtonText,
    Pressable,
    HStack,
    Text
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { collection, doc, query, where, getDocs, setDoc} from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

import AddListingBox from '../components/AddListingBox.js';

import colors from '../config/colors.js';
import fonts from '../config/fonts';
import PostBox from '../components/PostBox';

export default function AddPostPage() {
    const navigation = useNavigation();

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <Box w="100%" h="100%">
           {/* Header */}
            <Box backgroundColor={colors.primary}>
                <HStack p="$2" w="100%" mt={25} alignItems='center' >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Text fontSize={24} color={colors.white} lineHeight={50} fontFamily={fonts.semibold} m={10}>Create Post</Text>
                </HStack>
            </Box>

      
            <Box w="100%" p="$2" flex={1}>
                 <PostBox></PostBox>
            </Box>
        </Box>
    );
}