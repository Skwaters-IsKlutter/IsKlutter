import React, { useEffect, useState } from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box, 
    ScrollView,
    Button,
    ButtonIcon,
    ButtonText,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { database } from '../../config/firebase'; // Firebase configuration

export default function AllListingsPage({key}) {
    const navigation = useNavigation();
    const [allListingsData, setAllListingsData] = useState([]);

    useEffect(() => {
        // Set up a real-time listener for changes to the listings collection
        const listingsCollection = collection(database, 'listings');
        const unsubscribe = onSnapshot(listingsCollection, (querySnapshot) => {
            const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllListingsData(listingsData);
        });

        // Cleanup function detach the listener when the component unmounts
        return () => {
            // Check if unsubscribe is a function before calling it
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []); // Empty dependency array to run effect only once

    const renderAllListings = () => {
        return allListingsData.map((item) => {
            const firstTag = item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null;

            return (
                <ItemCard
                    key={item.key}
                    productImage={item.listingImageURL}
                    productPrice={item.listingPrice}
                    productName={item.listingName}
                    productSeller={item.username}
                    tags={firstTag}
                    toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item })}
                />
            );
        });
    };

    return (
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
                        {renderAllListings()}
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}