import * as React from 'react';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';

import ListingsScreen from './screens/ListingsScreen.js';

import colors from '../config/colors.js'

const Tab = createBottomTabNavigator();

export default function HomepagePage() {
    return (
        // <Tab.Navigator>
        //     <Tab.Screen name="Listings" component={ListingsScreen} />
        //     {/* <Tab.Screen name="Community" component={SettingsScreen} /> */}
        // </Tab.Navigator>
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeader />
            
            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                {/*Listing Box Container*/}
                <ScrollView>
                    <HStack space="xs" flexWrap="wrap">
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}