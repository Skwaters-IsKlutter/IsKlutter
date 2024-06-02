import React, { useState, useCallback } from 'react';
import { HStack, VStack, Heading, Box, ScrollView, Button, ButtonIcon, ButtonText, Text } from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { collection, getDocs, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';

import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function AllListingsPage() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })

    const navigation = useNavigation();
    const [allListingsData, setAllListingsData] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const fetchListings = useCallback(() => {
        const unsubscribeListings = onSnapshot(
            query(collection(database, 'listings'), where('bidding', '==', false)),
            (querySnapshot) => {
                const listingsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                Promise.all(listingsData.map(updateSellerInfo))
                    .then(updatedListings => setAllListingsData(updatedListings))
                    .catch(error => console.error('Error updating seller info:', error));
            }
        );

        return () => unsubscribeListings();
    }, []);

    useFocusEffect(fetchListings);

    const updateSellerInfo = async (item) => {
        const sellerID = item.sellerID;

        if (!sellerID) return item;

        try {
            const userQuerySnapshot = await getDocs(query(collection(database, 'users'), where('userID', '==', sellerID)));
            if (!userQuerySnapshot.empty && userQuerySnapshot.docs[0]) {
                const userDocument = userQuerySnapshot.docs[0];
                const sellerUsername = userDocument.data().username;
                const sellerImageURL = userDocument.data().userProfileImg || '';
                const listingsDocRef = doc(collection(database, 'listings'), item.id);
                await updateDoc(listingsDocRef, { productSeller: sellerUsername });

                return { ...item, username: sellerUsername, sellerImageURL };
            } else {
                console.error(`User document not found for sellerID: ${sellerID}`);
                return item;
            }
        } catch (error) {
            console.error('Error fetching user document:', error);
            return item;
        }
    };

    const handleSearchChange = (text) => {
        setSearchInput(text.toLowerCase());
    };

    const filteredListings = allListingsData.filter((item) => {
        if (item.sold) {
            return false; 
        }
        const listingName = item.listingName.toLowerCase();
        const username = item.username.toLowerCase();
        const tags = item.listingTags.map(tag => tag.toLowerCase());

        return (
            listingName.includes(searchInput) ||
            username.includes(searchInput) ||
            tags.some(tag => tag.includes(searchInput))
        );
    });

    const renderAllListings = () => {
        console.log("Rendering listings...");

        if (filteredListings.length === 0) {
            return <Text style={styles.endOfResults}>No Results Found</Text>;
        }

        return (
            <>
                {filteredListings.map((item) => (
                    <ItemCard
                        key={item.id}
                        productImage={item.listingImageURL}
                        productPrice={item.listingPrice}
                        productName={item.listingName}
                        productSeller={item.username}
                        sellerID={item.sellerID}
                        tags={item.listingTags.length > 0 ? item.listingTags[0] : null}
                        toListing={() => navigation.navigate(Routes.LISTINGS, {
                            selectedItem: item,
                            sellerImageURL: item.sellerImageURL
                        })}
                    />
                ))}
                <Text style={styles.endOfResults}>End of Results</Text>
            </>
        );
    };

    const styles = {
        endOfResults: {
            textAlign: 'center',
            paddingVertical: 20,
            fontSize: 18,
            color: 'gray'
        }
    };
    
    return (
        <Box w="100%" h="100%">
            <SearchHeader
                userIcon={require('../../assets/img/usericon.jpg')}
                placeholder="Search in listings"
                search={searchInput}
                onSearchChange={handleSearchChange}
            />

            <Box p="$5" w="100%" flex={1} >
                <VStack space="xs" pb="$2">
                    <HStack space="xs" justifyContent="space-between" alignItems="center">
                        <Text lineHeight={50} fontSize={40} color={colors.secondary} fontFamily={fonts.semibold} letterSpacing={-1}>
                            Listings
                        </Text>

                        <Button borderRadius={30} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDLISTING)} p={2}>
                            <ButtonIcon>
                                <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                            </ButtonIcon>
                            <ButtonText mt={2} p="$2" line fontSize="$lg" fontFamily={fonts.semibold} alignItems='center'>Post</ButtonText>
                        </Button>
                    </HStack>
                </VStack>

                <ScrollView>
                    <HStack space="xs" w="100%"flexWrap="wrap" justifyContent="center" >
                        {renderAllListings()}
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    );
}
