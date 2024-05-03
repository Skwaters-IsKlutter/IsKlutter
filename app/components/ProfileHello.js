import React, { useEffect, useState } from 'react';
import { auth, database } from '../../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
    Box,
    HStack,
    Heading,
    Pressable,
    MaterialCommunityIcons
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function HelloCard({username}) {

    return (
        <Box p="$5" w="100%">
            <HStack justifyContent="space-between">
                <Heading fontSize={30} lineHeight={30} color={colors.secondary}>
                    {username ? `Hello, ${username}!` : 'Loading...'}
                </Heading>
            </HStack>
        </Box>
    );
}