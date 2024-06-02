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
        <Box p="$2" w="100%" alignItems='center' >
            <Text fontFamily ={fonts.semibold} pt="$4">
            <Heading fontSize={40} lineHeight={40} color={colors.white}>
                {username ? `Hello, ${username}!` : 'Loading...'}
            </Heading>
            </Text>
        </Box>
    );
}