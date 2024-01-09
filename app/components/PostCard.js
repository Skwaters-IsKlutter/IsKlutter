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


export default function PostCard( { username, description, toIndividualPost} ) {

    return (
        <Pressable onPress={toIndividualPost} >
            <VStack>
                <Box 
                    backgroundColor={colors.white} 
                    borderRadius={5} 
                    width={370}
                    ml={10}
                    mt={10}>

                    <HStack space="sm" alignItems="center" p={5} m={5}>
                        <UserAvatar/> 
                        <Text color={colors.secondary}size="md" bold={true}>{username}</Text>
                        {/* <Text color={colors.gray} size="2xs">{postDate}</Text> */}
                    </HStack>

                    <Text color="black" pb="$3" size="sm" ml="$3" mt={2}>{description}</Text>

                    {/* <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} /> */}
                </Box>
            </VStack>
        </Pressable>
    )
}