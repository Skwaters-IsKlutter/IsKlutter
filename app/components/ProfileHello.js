import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonText,
    ScrollView
} from '@gluestack-ui/themed';

import TagLabel from '../components/TagLabel.js';

import colors from '../config/colors.js';

export default function HelloCard({ key: username}) {
    return (
        <Box p="$3" w="100%">
           <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Hello, {username}!</Heading>
                </VStack>
        </Box>
    )
}