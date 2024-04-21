import React from 'react';
import { Box, VStack, HStack, Heading, Text, Image, Pressable } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors.js';

export default function ItemCard({ productImage, productPrice, productName, productSeller, toListing, tags }) {
    const isImageUrl = typeof productImage === 'string';

    return (
        <Pressable onPress={toListing}>
            <Box bg={colors.white} borderRadius={10} width={150} maxHeight={256} m={2} flex={1} overflow="hidden">
                <Box p="$2">
                    {isImageUrl ? (
                        <Image
                            source={{ uri: productImage }}
                            style={{ height: 100, width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                            resizeMode="cover"
                            alt="icon"
                        />
                    ) : (
                        <Text>No Image Available</Text>
                    )}

                    <Heading fontSize="$2xl" color={colors.primary} mt={2}>
                        {`PHP ${productPrice}`}
                    </Heading>

                    <VStack space="xs" p={0}>
                        <Text fontSize="$md" fontWeight="bold">{productName}</Text>
                        <Text fontSize="$sm" color={colors.gray}>
                            <MaterialCommunityIcons name="account" size={15} mr={2} color={colors.primary} />
                            {productSeller}
                        </Text>
                    </VStack>
                    
                    <HStack space="sm" flexWrap="wrap" mt={2}>
                        <Text bgColor={colors.secondary} color={colors.white} borderRadius={10} p={7}>{tags}</Text>
                    </HStack>
                </Box>
            </Box>
        </Pressable>
    );
}
