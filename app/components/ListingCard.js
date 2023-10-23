import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonText,
    ScrollView
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function ListingCard({ productName, productImage, productPrice, productDesc, sellerName, sellerImage, sellerChat }) {
    return (
        <Box p="$3" w="100%" backgroundColor="$white">
            <VStack space="md" pb="$2">
                <Image source={productImage} h={230} w="100%" alt="item" borderRadius={3} />
            </VStack>

            {/* Item name and price */}
            <VStack space="sm" p="$2">
                <Heading fontSize="$2xl" color={colors.primary}>{productName}</Heading>
                <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{productPrice}</Text>
            </VStack>

            {/* Description */}
            <VStack space="sm" p="$2">
                <Text fontSize="$md">{productDesc}</Text>
            </VStack>

            {/* Poster info */}
            <HStack space="sm" p="$2" alignItems="center">
                <Image source={sellerImage} h={35} w={35} alt="icon" borderRadius={100} />
                <Text color={colors.gray}>{sellerName}</Text>
            </HStack>

            <VStack space="sm" p="$2">
                <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={12} onPress={sellerChat}>
                    <ButtonText color={colors.white} fontSize="$sm">Chat</ButtonText>
                </Button>
            </VStack>
        </Box>
    )
}