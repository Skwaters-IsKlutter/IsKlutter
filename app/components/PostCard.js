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
        <VStack>
            <Box p="$3" w="100%" backgroundColor={colors.white} m={3} borderRadius={8}>
                <HStack pb="$3" justifyContent="left">
                    {/* <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100}/>  */}
                    <UserAvatar username={username} userIcon={posterIcon} />
                    <Text color={colors.gray}size="sm" bold={true}>{posterName}</Text>
                    <Text color={colors.gray} size="2xs">{postDate}</Text>
                </HStack>

                <Text color="black" pb="$3" size="sm">{postContent}</Text>
                <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} />
            </Box>
        </VStack>
    )
}