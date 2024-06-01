import React from 'react';
import { Box, VStack, HStack, Heading, Text, Image, Pressable } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

export default function ItemCard({ productImage, productPrice, productName, productSeller, toListing, tags, sold }) {
    const isImageUrl = typeof productImage === 'string';

    return (
        <Pressable onPress={toListing}>
            <Box bg={colors.white} borderRadius={10} width={170} maxHeight={256} m={6} flex={1} overflow="hidden">
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

                   
                    <Text fontFamily={fonts.semibold} height={25} mt="$2" >
                        <Heading fontSize="$2xl" color={colors.primary} >
                            {`₱ ${productPrice}`}
                        </Heading>
                    </Text>

                    <VStack space="xs" p={3}>
                        <Text fontSize="$md"  fontFamily={fonts.regular} color={colors.black}>{productName}</Text>
                        {/* <HStack alignItems='center'>
                            <MaterialCommunityIcons name="account" size={15} mr={2} color={colors.primary}   />      
                            <Text fontSize="$sm" color={colors.black} fontFamily={fonts.regular} pl="$2">{productSeller}
                            </Text>
                        </HStack> */}
                    </VStack>
                    
                    <HStack space="sm" flexWrap="wrap" mt={5}>
                        <Text bgColor={colors.secondary} 
                            color={colors.white}
                            borderRadius={10} 
                            p={7} fontFamily={fonts.regular}
                            >{tags}</Text>
                        {sold && (
                        <Text
                            bg={colors.red}
                            color={colors.white}
                            fontSize="$md"
                            padding={7}
                            borderRadius={10}
                        >
                            Sold
                        </Text>
                    )}
                    </HStack>
                </Box>
            </Box>
        </Pressable>
    );
}
