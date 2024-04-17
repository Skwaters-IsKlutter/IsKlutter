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

export default function SpecificBidCard({ listingName, listingPrice,highestBidderName,highestBiddingPrice, remainingTime }) {
    const navigation = useNavigation();
    const route = useRoute();
    

    return (
        <Box backgroundColor="$white" m={15} bg={colors.white} p={5} borderRadius={10}>
            <VStack space="xs" p="$2">
                <Box bgColor='$black' w="100%" h={240}></Box>
                <Heading fontSize="$2xl" color={colors.primary}>{listingName}</Heading>
                <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{`PHP ${listingPrice}`}</Text>
                <Text color={colors.black} bold="true">Remaining Time: {remainingTime}</Text>
                <Text color={colors.black}>Highest Bidder: {highestBidderName}</Text>
                <Text color={colors.black}>Highest Bidding Price: PHP {highestBiddingPrice}</Text>
            </VStack>
        </Box>
       
    )
}