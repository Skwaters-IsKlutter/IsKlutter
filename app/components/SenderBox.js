import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
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


export default function SenderBox( {recipientName} ) {
    const navigation = useNavigation();
    return (
        <Box w="100%" maxHeight={150} bg={colors.white}>
            <HStack p="$3" w="100%"  alignItems="center" mt={40} justifyContent="flex-start">
                <Pressable onPress={navigation.goBack}>
                    <MaterialCommunityIcons name="arrow-left-bold" color={colors.primary} size={30} p={5} />
                </Pressable>
                {/* <UserAvatar username={recipientName} /> */}
                <VStack>
                    <Pressable >
                        <Text color={colors.primary} m={10} size='2xl' bold={true}>{recipientName}</Text>
                    </Pressable>
                    {/* <Text color={colors.black} size="xs">{senderUsername}</Text>   */}
                </VStack>
            </HStack>
        </Box>
    )
}