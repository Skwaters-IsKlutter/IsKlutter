import React from 'react';

import { HStack, Text, Box, } from '@gluestack-ui/themed';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';
    
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

export default function AllBidderListCard({bidder, biddingPrice}) {
    return(
        <Box bg={colors.white} p={10} m={5}>
            <HStack justifyContent="space-between" alignItems="center">
                <Text color={colors.black} fontFamily={fonts.regular}>{bidder}</Text>
                <Text color={colors.secondary} fontFamily={fonts.bold}>PHP {biddingPrice}</Text>
            </HStack>
        </Box>

    )  
}