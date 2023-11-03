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

export default function CommentBox( {comment, posterUser, posterIcon} ) {
    return (
        <Box p="$2" bg={colors.white}>
            <Box w="100%" maxWidth="$60" pb="$2">
                <HStack space="sm" justifyContent="center" alignItems="center">
                    <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100} />
                    <Input bg={colors.white} borderColor={colors.secondary} h={80} w="75%">
                        <InputField multiline={true} size="md" placeholder="Write a comment..." />
                    </Input>
                </HStack>
            </Box>
            
            <VStack space="sm" p="$2" alignItems="right">
                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={12} onPress={comment}>
                    <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText>
                </Button>
            </VStack>
        </Box>
    )
}