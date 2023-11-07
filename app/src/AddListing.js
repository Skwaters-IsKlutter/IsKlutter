import React from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box, 
    ScrollView,
    Button,
    ButtonIcon,
    ButtonText
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import TagLabel from '../components/TagLabel.js';

import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';

export default function AddListingPage() {
    const navigation = useNavigation();
    
    return (
        // <Tab.Navigator>
        //     <Tab.Screen name="Listings" component={ListingsScreen} />
        //     {/* <Tab.Screen name="Community" component={SettingsScreen} /> */}
        // </Tab.Navigator>
        
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeader userIcon={ require("../../assets/img/usericon.jpg") } />

        </Box>
    )
}