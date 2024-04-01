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
import Routes from '../components/constants/Routes.js';

import colors from '../config/colors.js';
import CommentBox from './CommentBox.js';
import { doc, deleteDoc } from 'firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';


export default function IndividualPostCard({username, description}) {

    const navigation = useNavigation();
    const route = useRoute();

    return (
        <Box p="$3" w="100%" backgroundColor="$white">
            <VStack >
                    <HStack space="sm" alignItems="center">
                        <UserAvatar/> 
                        <Heading color={colors.primary} size={10} bold={true}>
                            {/* {username} */}
                            {username}
                        </Heading>                       
                         {/* <Text color={colors.gray} size="2xs">{postDate}</Text> */}
                    </HStack>

                    <Text color="black" pb="$3" size="md" mt="$3">{description}</Text>
    
            </VStack>

            {/* <CommentBox comment={() => Alert.alert("Alert", "This is a dummy action")} /> */}
        </Box>
    )
}
