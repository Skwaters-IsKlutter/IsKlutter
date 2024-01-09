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

import UserAvatar from './Avatar.js';

import colors from '../config/colors.js';
import CommunityCommentBox from './CommunityCommentBox.js';
import { useNavigation } from '@react-navigation/native';


export default function IndividualPostCard({username, description}) {

    const navigation = useNavigation();

    return (
        <Box p="$3" w="100%" backgroundColor="$white">
            <VStack width="100%">
                    <HStack space="sm" alignItems="center">
                        <UserAvatar/> 
                        <Heading color={colors.secondary}size="sm" bold={true}>{username}</Heading>
                        {/* <Text color={colors.gray} size="2xs">{postDate}</Text> */}
                    </HStack>

                    <Text color="black" pb="$3" size="sm" ml="$3" mt="$3">{description}</Text>

                    <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} />
               
            </VStack>
        </Box>
    )
}