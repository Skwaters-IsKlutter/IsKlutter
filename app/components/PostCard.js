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

export default function PostCard( { posterIcon, posterName, postDate, postContent, username} ) {
    return (
        <VStack pb={6}>
            <Box p={15} w="100%" backgroundColor={colors.white} borderRadius={8}>
                <HStack space="sm" alignItems="center">
                    <UserAvatar username={username} userIcon={posterIcon} />
                    <Text color={colors.gray}size="sm" bold={true}>{posterName}</Text>
                    <Text color={colors.gray} size="2xs">{postDate}</Text>
                </HStack>

                <Text color="black" pb="$3" size="sm" ml="$3" mt="$3">{postContent}</Text>

                <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} />
            </Box>
        </VStack>
    )
}