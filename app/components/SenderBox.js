import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Input,
    InputField,
    InputSlot,
    InputIcon,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    Pressable,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import UserAvatar from './Avatar.js';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';


export default function SenderBox( { senderIcon, senderName, senderUsername} ) {
    const navigation = useNavigation();
    return (
        <Box>
            <HStack>
                <Pressable>
                    <MaterialCommunityIcons name= "arrow-left" color={colors.black} size={40}/> 
                </Pressable>
                <UserAvatar username={senderUsername} userIcon={senderIcon} />
                <VStack>
                    <Text color={colors.black}size="l" bold={true}>{senderName}</Text>
                    <Text olor={colors.black} size="xs">{senderUsername}</Text>  
                </VStack>
            </HStack>
        </Box>
    )
}