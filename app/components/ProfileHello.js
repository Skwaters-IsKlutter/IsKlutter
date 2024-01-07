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
        <Box p="$3" w="100%">
            <Heading lineHeight={60} fontSize="$2xl" color={colors.secondary}>
                {username ? `Hello, ${username}!` : 'Loading...'}
            </Heading>
        </Box>
    );
}