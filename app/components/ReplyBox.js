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

export default function CommentBox( {key : replyID, replyText, replyUser, replyDate, replyTime, userIcon} ) {
    return (
        <Box p="$2" h="auto" bg={colors.white} flex={1}>
            <Box w="100%" maxWidth="$60" pb="$2">
                <VStack space="sm" pl="21%" m={6}>
                    <HStack space="sm">
                        <Text color={colors.gray} fontSize="$lg" fontWeight="$extrabold">{replyUser}</Text>
                        <HStack space="sm" pl="30%">
                            <Text color={colors.gray} fontSize="$xs">{replyDate}</Text>
                            <Text color={colors.gray} fontSize="$xs">{replyTime}</Text>
                        </HStack>
                    </HStack>
                </VStack>

                <HStack space="sm" justifyContent="center" alignItems="center">
                    <Image source={userIcon} h={45} w={45} alt="icon" borderRadius={100} />
                    <Box h="$10" w="75%">
                        <Input bg={colors.white} borderColor={colors.secondary} p={10}>
                            <Text>{replyText}</Text>
                        </Input>
                    </Box>
                </HStack>
            </Box>
        </Box>
    )
}