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

import UserAvatar from './Avatar.js';

import colors from '../config/colors.js';

export default function CommunityCommentBox( {comment, posterUser, posterIcon} ) {
    return (
        <Box bg={colors.white}>
            <Box w="$64" flex={1}>
                <HStack space="md" justifyContent="space-evenly" p={2} alignItems="center">
                    {/* <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100} /> */}
                    {/* <UserAvatar username={posterUser} userIcon={posterIcon} /> */}

                    <Input bg={colors.white} borderColor={colors.secondary} h={80} w="100%">
                        <InputField multiline={true} size="md" placeholder="Write a comment..." />
                    </Input>
                </HStack>

                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={8} onPress={comment} mt={10} w="40%" alignSelf="flex-end">
                    <ButtonText color={colors.white} fontSize="$sm">Comment</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}