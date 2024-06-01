import React from 'react';
import {
    Box,
    Text,
    Pressable
} from '@gluestack-ui/themed';

import colors from '../config/colors';
import fonts from '../config/fonts';

export default function TagLabel( {tagName, viewTag} ) {
    return (
            <Pressable onPress={viewTag}>
            <Box bg={colors.secondary} borderRadius={15} >
                <Text color={colors.white} p={8} fontFamily={fonts.semibold}>{tagName}</Text>
            </Box>
        </Pressable>
    )
}