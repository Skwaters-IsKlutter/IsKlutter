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

import colors from '../config/colors.js';

export default function CommentBox( {replyText, replyUser, userIcon} ) {
    return (
        <Box p="$2" bg={colors.white}>
            <Box w="100%" maxWidth="$60" pb="$2">
                <VStack space="sm" pl="21%">
                    <Text>{replyUser}</Text>
                </VStack>

                <HStack space="sm" justifyContent="center" alignItems="center">
                    <Image source={userIcon} h={45} w={45} alt="icon" borderRadius={100} />
                    <Box h="$10" w="75%">
                        <Input bg={colors.white} borderColor={colors.secondary} p={6}>
                            <Text>{replyText}</Text>
                        </Input>
                    </Box>
                </HStack>
            </Box>
        </Box>
    )
}