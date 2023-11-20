import React from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box, 
    ScrollView,
    Button,
    ButtonIcon,
    ButtonText,
    Text
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ItemCard from '../components/ItemCard.js';
import TagLabel from '../components/TagLabel.js';
import AddListingBox from '../components/AddListingBox.js';

import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';

export default function AddListingPage() {
    const navigation = useNavigation();
    
    return (        
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg") } back={navigation.goBack} />

            <Box p="$6" w="100%" maxWidth="$96">
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Create a Listing</Heading>
                </VStack>

                <ScrollView>
                    <Box bg={colors.medium}>
                        <VStack space="xs">
                            <AddListingBox listingImage={ require("../../assets/img/item.jpg") } />
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>

        </Box>
    )
}