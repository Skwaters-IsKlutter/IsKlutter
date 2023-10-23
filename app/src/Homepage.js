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
import TabsFooter from '../components/TabsFooter.js';

import ListingsScreen from './screens/ListingsScreen.js';

import colors from '../config/colors.js'

const Tab = createBottomTabNavigator();

export default function HomepagePage() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Listings" component={ListingsScreen} />
            {/* <Tab.Screen name="Community" component={SettingsScreen} /> */}
        </Tab.Navigator>
        // Parent box
        // <Box w="100%" h="100%">
        //     {/*Search Bar*/}
        //     <SearchHeader />
            
        //     <Box p="$6" w="100%" maxWidth="$96" flex={1}>
        //         {/*Listings Label */}
        //         <VStack space="xs" pb="$2">
        //             <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
        //         </VStack>

        //         {/*Listing Box Container*/}
        //         <ScrollView>
        //             <HStack space="xs" flexWrap="wrap">
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //                 <ItemCard />
        //             </HStack>
        //         </ScrollView>
        //     </Box>
    


            // {/*Dashboard */}
            // /* <Box top="90%" position="absolute" h="20%" width="100%" backgroundColor="$green" borderRadius={50} alignItems='center'>
            //     <HStack space="xs" p="$5">
            //         <Button variant="solid"  backgroundColor={colors.secondary} >
            //             <ButtonText sx={{
            //                 color: colors.medium
            //             }}>Listings</ButtonText>
            //         </Button>
            //         <Button variant="solid"  backgroundColor={colors.secondary}>
            //             <ButtonText sx={{
            //                 color: colors.medium
            //             }}>Community</ButtonText>
            //         </Button>     
            //         <Button variant="solid"  backgroundColor={colors.secondary}>
            //             <ButtonText sx={{
            //                 color: colors.medium
            //             }}>Profile</ButtonText>
            //         </Button>        
            //     </HStack>   
            // </Box> */
    )
}