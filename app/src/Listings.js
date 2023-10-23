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

import SearchHeader from '../components/SearchHeader.js';
import TabsFooter from '../components/TabsFooter.js';
import ListingCard from '../components/ListingCard.js';

import colors from '../config/colors.js';

export default function ListingsPage({ productName, productImage, productPrice, productDesc, seller }) {
    return (
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeader />

            {/*Tabs */}
            <TabsFooter />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                <ScrollView>
                    <VStack space="xs" flexWrap="wrap">
                        <ListingCard 
                            productImage={ require("../../assets/img/item.jpg") }
                            productName="Kuromi Plush"
                            productPrice="PHP 300"
                            productDesc="This is a Kuromi plushie."
                            sellerName="cinnamonroll"
                            sellerImage={ require("../../assets/img/usericon.jpg") }
                        />
                    </VStack>
                </ScrollView>
            </Box>
        </Box>
    );
}