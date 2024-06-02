import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

export default function SpecificBidCard({ listingName, listingPrice, highestBidderName, highestBiddingPrice, remainingTime, listingImage, bidIncrement }) {
    return (
        <Box p="$3" w="100%">
            <Box bg={colors.white} >
                <VStack space="md" p="$2">
                {listingImage ? (
                    <Image
                        source={{ uri: listingImage }}
                        style={{ height: 240, width: "100%", borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                        resizeMode="cover"
                        alt="Listing Image"
                    />
                ) : (
                    <Text>No Image Available</Text>
                )}
                </VStack>
                
                <VStack space="md" p="$2">
                    <HStack w="100%" justifyContent="space-between">
                        <Text fontFamily={fonts.bold} fontSize="$xl" color={colors.primary}>{listingName}</Text>
                        <Text fontFamily={fonts.bold} fontSize="$lg" color={colors.secondary}>{`PHP ${listingPrice}`}</Text>
                    </HStack>
                </VStack>
            
                <Text fontFamily={fonts.semibold} color={colors.black} pl="$2">Remaining Time: {remainingTime}</Text>
                <Text fontFamily={fonts.semibold} color={colors.black} pl="$2">Highest Bidder: {highestBidderName}</Text>
                <Text fontFamily={fonts.semibold} color={colors.black} pl="$2">Highest Bid: PHP {highestBiddingPrice}</Text>
                <Text color={colors.black} fontFamily={fonts.semibold} pl="$2" pb="$2">Bidding Increment: {bidIncrement}</Text>
            </Box>    
        </Box>
    )
}
