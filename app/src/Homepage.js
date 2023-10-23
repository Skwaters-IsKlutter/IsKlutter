import React from 'react';
import {
    HStack,
    VStack,
    Heading,
    Image,
    Box, 
    Button, 
    ButtonText, 
    FormControl, 
    Input, 
    InputField,
    Text,
    ScrollView,
    Pressable
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import TabsFooter from '../components/TabsFooter.js';

import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';

export default function HomepagePage() {
    const navigation = useNavigation();
    return (
        // <Tab.Navigator>
        //     <Tab.Screen name="Listings" component={ListingsScreen} />
        //     {/* <Tab.Screen name="Community" component={SettingsScreen} /> */}
        // </Tab.Navigator>
        
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeader />

            {/*Bottom Navigation */}
            <TabsFooter />
            
            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                {/*Listing Box Container*/}
                <ScrollView>
                    <HStack space="xs" flexWrap="wrap">
                        <ItemCard price="PHP 300" productName="Plushie" seller="cinammonroll" toListing={navigation.navigate(Routes.LISTINGS)} />
                        <ItemCard price="PHP 300" productName="Plushie" seller="cinammonroll" toListing={() => Alert.alert("Alert", "This is a dummy action")}/>
                        <ItemCard price="PHP 300" productName="Plushie" seller="cinammonroll" />
                        <ItemCard price="PHP 300" productName="Plushie" seller="cinammonroll" />
                        <ItemCard price="PHP 300" productName="Plushie" seller="cinammonroll" />
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}