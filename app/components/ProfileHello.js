import React, { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    Box,
    VStack,
    Heading,
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function HelloCard({username}) {

    return (
        <Box p="$2" w="100%" lineHeight={100}>
            <Heading fontSize="$4xl" color={colors.secondary}>
                {username ? `Hello, ${username}!` : 'Loading...'}
            </Heading>
        </Box>
    );
}