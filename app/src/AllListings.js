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

export default function AllListingsPage() {
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

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label and post button */}
                <VStack space="xs" pb="$2">
                    <HStack space="xs" justifyContent="space-between" alignItems="center">
                        <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                        <Button borderRadius={8} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDLISTING)}>
                            <ButtonIcon>
                                <MaterialCommunityIcons name="post" size={15} color={colors.white} />
                            </ButtonIcon>
                            <ButtonText>Post</ButtonText>
                        </Button>
                    </HStack>
                </VStack>

                {/*Listing Box Container*/}
                <ScrollView>
                    <HStack space="xs" flexWrap="wrap" justifyContent="center">
                        <ItemCard 
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="PHP 300"
                            productName="Kuromi Plush"
                            productSeller="cinnamonroll"
                            tags={[<TagLabel tagName="toys" />, <TagLabel tagName="new" />, <TagLabel tagName="plushie" />, <TagLabel tagName="sold" />]}
                            toListing={() => navigation.navigate(Routes.LISTINGS)}
                        />
                        <ItemCard
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="Price" productName="Product"
                            productSeller="Seller"
                            tags={[<TagLabel tagName="dummy" />, <TagLabel tagName="dummy" />]}
                            toListing={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                        <ItemCard
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="Price" productName="Product"
                            productSeller="Seller"
                            tags={[<TagLabel tagName="dummy" />, <TagLabel tagName="dummy" />]}
                            toListing={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                        <ItemCard
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="Price" productName="Product"
                            productSeller="Seller"
                            tags={[<TagLabel tagName="dummy" />, <TagLabel tagName="dummy" />]}
                            toListing={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                        <ItemCard
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="Price" productName="Product"
                            productSeller="Seller"
                            tags={[<TagLabel tagName="dummy" />, <TagLabel tagName="dummy" />]}
                            toListing={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                        <ItemCard
                            productImage={ require("../../assets/img/item.jpg") }
                            productPrice="Price" productName="Product"
                            productSeller="Seller"
                            tags={[<TagLabel tagName="dummy" />, <TagLabel tagName="dummy" />]}
                            toListing={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}