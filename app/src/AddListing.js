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
            <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} />

            <Box p="$6" w="100%" maxWidth="$96">
                
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$3xl" color={colors.secondary}>Sell Your Product</Heading>
                </VStack>

                <ScrollView>
                    <Box bg={colors.medium} borderRadius={50}>
                        <VStack space="xs">
                            <AddListingBox listingImage={require("../../assets/img/item.jpg")} />
                        </VStack>
                    </Box>
                </ScrollView>
                <HStack p="$3" justifyContent='center'>
                    <Button variant="solid" size="sm" bg={colors.primary} borderRadius={10} m={5}>
                        <ButtonText color={colors.white} fontSize="$sm">Post Now</ButtonText>
                    </Button>

                    <Button variant="solid" size="sm" bg={colors.gray} borderRadius={10} m={5}>
                        <ButtonText color={colors.white} fontSize="$sm">Cancel</ButtonText>
                    </Button>
                </HStack>
            </Box>

        </Box>
    )
}