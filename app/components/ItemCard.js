import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function ItemCard() {
    return (
        <Box backgroundColor="white" borderRadius={10} width="45%" h={230} m="2%" marginTop={0}>
            <VStack padding={5} flex={1} top={5}>
                {/* <Image source={ require("../../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/> */}
                <Heading fontSize="$2xl" ml={10} color='darkgreen'>Price</Heading>
                <Text fontSize="$md" marginTop="-5px" ml={10}>Product Name</Text>
            </VStack>
            {/*Seller Part */}
            <HStack space="xs" p="$2">
                {/* <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/> */}
                <Text>Seller</Text>
                <Button variant="solid" size="sm" backgroundColor="maroon" borderRadius={100}>
                    <ButtonText sx={{
                        color: "$white"
                    }}>Chat</ButtonText>
                </Button>
            </HStack>
        </Box>
    )
}