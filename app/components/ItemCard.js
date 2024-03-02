import React from 'react';
import { Box, VStack, HStack, Heading, Text, Image, Pressable } from '@gluestack-ui/themed';
import colors from '../config/colors.js';

export default function ItemCard({ productImage, productPrice, productName, productSeller, sellerID, toListing, tags }) {
    const isImageUrl = typeof productImage === 'string';

    return (
        <Pressable onPress={toListing}>
            <Box bg={colors.white} borderRadius={10} width={150} maxHeight={256} m="2%" flex={1} overflow="hidden">
                <Box p="$2">
                    <VStack space="xs" p={0}>
                        {isImageUrl && (
                            <Image
                                source={{ uri: productImage }}
                                style={{ height: 100, width: '100%'}}
                                resizeMode="cover"
                                alt="icon"
                                borderTopLeftRadius={5}
                                borderTopRightRadius={5}
                            />
                        )}
                        {!isImageUrl && (
                            <Text>No Image Available</Text>
                        )}
                        <Heading fontSize="$xl" color={colors.primary}>
                            {`PHP ${productPrice}`}
                        </Heading>
                    </VStack>

                    <VStack space="xs" p={0}>
                        <Text fontSize="$md" fontWeight="$bold">{productName}</Text>
                        <Text fontSize="$sm" color={colors.gray}>{productSeller}</Text>
                    </VStack>

                    <HStack space="xs" p={0} flexWrap="wrap"><Text>{tags}</Text></HStack>
                </Box>
            </Box>
        </Pressable>
    );
}
