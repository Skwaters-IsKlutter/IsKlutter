import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Image,
    Button,
    ButtonText,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';

import colors from '../config/colors.js';

export default function CommentBox( {comment, posterUser, posterIcon} ) {
    return (
        <Box p="$3" w="100%" maxWidth="$60" bg={colors.white} justifyContent="center" alignItems="center">
            <HStack space="sm">
                <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100} />
                <Input bg={colors.white} borderColor={colors.primary} h="$20" w="75%">
                    <InputField multiline={true} size="md" placeholder="Write a comment" />
                </Input>
            </HStack>

            <VStack space="sm" p="$2">
                <Text fontSize="$md">{comment}</Text>
            </VStack>
        </Box>
    )
}