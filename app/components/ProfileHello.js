import React, { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    Box,
    VStack,
    Heading,
    Text
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

export default function HelloCard({username}) {

    return (
        <Box w="100%" alignItems='center' >
            <Text fontSize={35} lineHeight={40} color={colors.white} fontFamily={fonts.bold}>
                {username ? `Hello, ${username}!` : 'Loading...'}
            </Text>
        </Box>
    );
}