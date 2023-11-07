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

export default function AddListingBox( {user, listingImage, listingName, listingPrice, listingTags} ) {
    return (
        <Box p="$2" bg={colors.white}>
            <Box w="100%" maxWidth="$60" pb="$2">

            </Box>
        </Box>
    )
}