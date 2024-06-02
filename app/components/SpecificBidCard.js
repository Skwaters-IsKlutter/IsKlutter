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
                    </HStack>
                    <Text fontFamily={fonts.bold} fontSize="$lg" color={colors.secondary} fontWeight="$bold">{`PHP ${listingPrice}`}</Text>
                </VStack>
                
                <VStack space="md" p="$2">
                <Text fontFamily={fonts.semibold} color={colors.black} size="md">Remaining Time: {remainingTime}</Text>
                    <Text fontFamily={fonts.semibold} color={colors.black}>Highest Bidder: {highestBidderName}</Text>
                    <Text fontFamily={fonts.semibold} color={colors.black}>Highest Bid: PHP {highestBiddingPrice}</Text>
                    <Text color={colors.black} fontFamily={fonts.semibold}>Bidding increment {bidIncrement}</Text>

                </VStack>
            </Box>    
        </Box>
    )
}
