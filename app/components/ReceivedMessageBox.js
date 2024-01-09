import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text,
    Image,
    Pressable
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import UserAvatar from './Avatar.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function ReceivedMessageBox( { senderIcon, senderName, message, senderUsername, username} ) {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.navigate(Routes.PRIVATEMESSAGE)} >

                    <VStack width={380} backgroundColor={colors.white}  m={5}>
                            
                            <HStack space="sm" alignItems="center" m={10} >
                                    <UserAvatar username={senderUsername} userIcon={senderIcon} />
                                    <Text color={colors.black}size="2s" bold={true}>{senderName}</Text>
                                    <Text color={colors.black} size="xs">{senderUsername}</Text>           
                            </HStack>

                            <Text color="black" pb="$3" pr="$3"size="sm" ml="$3" mt="$2">{message}</Text>
                    </VStack>

        </Pressable>
        
)



       
}