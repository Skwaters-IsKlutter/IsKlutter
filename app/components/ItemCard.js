import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text,
    Image,
    Pressable
} from '@gluestack-ui/themed';

import TagLabel from '../components/TagLabel.js';

import colors from '../config/colors.js';

export default function ItemCard( {image, price, productName, seller, sellerIcon, toListing, tags} ) {
    return (
        <Pressable onPress={toListing}>
            <Box bg={colors.white} borderRadius={10} width={150} h={220} m="2%">
                <Box p="$2" flex={1}>
                    <VStack space="xs" p={0}>
                        <Image source={image} h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                        <Heading fontSize="$xl" color={colors.secondary}>{price}</Heading>
                    </VStack>

                    <VStack space="xs" p={0}>
                        <Text fontSize="$md" fontWeight="$bold">{productName}</Text>
                        <Text fontSize="$sm" color={colors.gray}>{seller}</Text>
                    </VStack>

                    <HStack space="xs" p={0}>{tags}</HStack>
                </Box>
            </Box>
        </Pressable>
    )
}