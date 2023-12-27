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
    ScrollView
} from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors.js';

export default function ListingCard({ key: productID, productName, productImage, productPrice, productDesc, sellerName, sellerImage, sellerChat, tags }) {
    return (
        console.log('Product Image:', productImage),
        <Box p="$3" w="100%" backgroundColor="$white">
            <VStack space="md" pb="$2">
                <Image source={productImage ? { uri: productImage } : null} h={230} w="100%" alt="item" borderRadius={3} />
            </VStack>

            {/* Item name and price */}
            <VStack space="sm" p="$2">
                <Heading fontSize="$2xl" color={colors.primary}>{productName}</Heading>
                <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{productPrice}</Text>
            </VStack>

            {/* Tags */}
            <HStack space="sm" p="$2">
                {tags.map((tag, index) => (
                    <Text key={index}>{tag}</Text>
                ))}
            </HStack>

            {/* Description */}
            <VStack space="sm" p="$2">
                <Text fontSize="$md">{productDesc}</Text>
            </VStack>

            {/* Poster info */}
            <HStack justifyContent="space-between" flexDirection="row">
                <HStack space="sm" p="$2" alignItems="center">
                    <Image source={sellerImage} h={35} w={35} alt="icon" borderRadius={100} />
                    <Text color={colors.gray}>{sellerName}</Text>

                    <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={8} onPress={sellerChat} alignSelf="flex-end">
                        <ButtonIcon>
                            <MaterialCommunityIcons name="chat" size={13} color={colors.white} />
                        </ButtonIcon>
                        <ButtonText color={colors.white} fontSize="$sm">Chat</ButtonText>
                    </Button>
                </HStack>
            </HStack>
        </Box>
    )
}