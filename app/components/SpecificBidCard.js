import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonIcon,
    ButtonText,
} from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { doc, deleteDoc } from 'firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';
import { Alert } from 'react-native';

import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
// import Routes from '../components/constants/Routes.js';

// const getCurrentUserID = () => {
//     const currentUser = auth.currentUser;
  
//     if (currentUser) {
//       return currentUser.uid;
//     } else {
//       // Handle the case where there is no logged-in user
//       return null;
//     }
// };

export default function SpecificBidCard({ listingName, listingPrice, highestBidderName, highestBiddingPrice, remainingTime }) {
    const navigation = useNavigation();
    const route = useRoute();
    

    return (
        <Box p="$3" w="100%">
            <Box bg={colors.white} >
                <VStack space="md" p="$2">
                    <Box bgColor='$black' w="100%" h={240} />
                </VStack>
                
                <VStack space="md" p="$2">
                    <HStack w="100%" justifyContent="space-between">
                        <Heading fontSize="$2xl" color={colors.primary}>{listingName}</Heading>
                    </HStack>
                    <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{`PHP ${listingPrice}`}</Text>
                </VStack>
                
                <VStack space="md" p="$2">
                    <Heading color={colors.black} size="md">Remaining Time: {remainingTime}</Heading>
                    <Text color={colors.black}>Highest Bidder: {highestBidderName}</Text>
                    <Text color={colors.black}>Highest Bid: PHP {highestBiddingPrice}</Text>
                </VStack>
            </Box>    
        </Box>
    )
}