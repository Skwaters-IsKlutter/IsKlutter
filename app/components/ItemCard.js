import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text,
    Image
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function ItemCard( {image, price, productName, seller, sellerIcon} ) {
    return (
        <Box backgroundColor={colors.white} borderRadius={10} width={150} h={220} m="2%">
            <Box p="$2" flex={1}>
                <VStack space="xs" p={0}>
                    <Image source={ require("../../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                    <Heading fontSize="$xl" color={colors.secondary}>{price}</Heading>
                </VStack>

                <VStack space="xs" p={0}>
                    <Text fontSize="$md" fontWeight="$bold">{productName}</Text>
                    <Text fontSize="$sm" color={colors.gray}>{seller}</Text>
                </VStack>

                {/*Seller Part */}
                <VStack space="xs" p={0}>
                    {/* <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/> */}
                    <Button variant="solid" size="xs" backgroundColor={colors.primary} borderRadius={12}>
                        <ButtonText sx={{
                            color: colors.white
                        }}>Chat</ButtonText>
                    </Button>
                </VStack>
            </Box>
        </Box>
    )
}