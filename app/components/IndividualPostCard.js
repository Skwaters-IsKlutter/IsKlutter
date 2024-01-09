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
        <Box w="100%" backgroundColor="$white" p={10}>
            <VStack>
                    <HStack space="sm" alignItems="center">
                        <UserAvatar/> 
                        <Heading color={colors.secondary} size="md" bold={true}>
                            {username}
                        </Heading>                       
                         {/* <Text color={colors.gray} size="2xs">{postDate}</Text> */}
                    </HStack>

                    <Text color="black" pb="$3" size="xl" mt="$3">{description}</Text>
    
            </VStack>
            {/* <CommunityCommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} /> */}
        </Box>
    )
}