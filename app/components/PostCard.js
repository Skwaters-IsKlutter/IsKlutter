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

export default function PostCard( { username, description} ) {
    return (
        <Pressable onPress={() => Alert.alert("Alert", "Cannot open post")} >
            <VStack pb={6}>
                <Box p={15} w="100%" backgroundColor={colors.white} borderRadius={8}>
                    <HStack space="sm" alignItems="center">
                        <UserAvatar/> 
                        <Text color={colors.secondary}size="sm" bold={true}>{username}</Text>
                        {/* <Text color={colors.gray} size="2xs">{postDate}</Text> */}
                    </HStack>

                    <Text color="black" pb="$3" size="sm" ml="$3" mt="$3">{description}</Text>

                    <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} />
                </Box>
            </VStack>
        </Pressable>
    )
}