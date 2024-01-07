import React from 'react';
import {
    Box,
    Text,
    Pressable
} from '@gluestack-ui/themed';

import colors from '../config/colors';

export default function TagLabel( {tagName, viewTag} ) {
    return (
            <Pressable onPress={viewTag}>
            <Box bg={colors.primary} borderRadius={6}>
                <Text color={colors.white} p={7}>{tagName}</Text>
            </Box>
        </Pressable>
    )
}