import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, ScrollView, Heading, Text, HStack, VStack, Pressable } from '@gluestack-ui/themed';

import SearchHeader from '../components/SearchHeader.js';
import ViewProfileCard from '../components/ViewProfileCard.js';
import ItemCard from '../components/ItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import fonts from '../config/fonts.js';
import BackHeader from '../components/BackHeader.js';
import { useWindowDimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ViewProfile() {
    const navigation = useNavigation();
    const route = useRoute();
    const [sellerProfile, setSellerProfile] = useState(null);
    const [userListings, setUserListings] = useState([]);
    const [userBiddings, setUserBiddings] = useState([]);
    const { height } = useWindowDimensions();
    const [viewCardHeight, setViewCardHeight] = useState(0);

    const handleViewCardLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        setViewCardHeight(height);
    }, []);

    const boxHeight = viewCardHeight + 70;

    useEffect(() => {
        const sellerID = route.params?.sellerID;

        if (!sellerID) {
            console.error("Seller ID is undefined in route params");
            return;
        }

        const fetchSellerProfile = async () => {
            const q = query(collection(database, 'users'), where('userID', '==', sellerID));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const sellerDoc = querySnapshot.docs[0];
                const sellerDocSnapshot = await getDoc(doc(database, sellerDoc.ref.path));

                if (sellerDocSnapshot.exists()) {
                    const sellerData = sellerDocSnapshot.data();
                    setSellerProfile(sellerData);
                } else {
                    console.error('Seller document does not exist.');
                }
            } else {
                console.error('Seller document not found.');
            }
        };

        const fetchSellerListings = async () => {
            const sellerListingQuery = query(collection(database, 'listings'), where('sellerID', '==', sellerID));
            const sellerListingQuerySnapshot = await getDocs(sellerListingQuery);
            const listings = sellerListingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const biddings = listings.filter(listing => listing.bidding === true);
            const nonBiddings = listings.filter(listing => listing.bidding === false);

            setUserListings(nonBiddings);
            setUserBiddings(biddings);
        };

        fetchSellerProfile();
        fetchSellerListings();
    }, [route.params]);

    const renderListings = (listings) => {
        return listings.map((item) => {
            const firstTag = item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null;

            return (
                <ItemCard
                    key={item.id}
                    productImage={item.listingImageURL}
                    productPrice={item.listingPrice}
                    productName={item.listingName}
                    productSeller={sellerProfile?.username}
                    tags={firstTag}
                    toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: sellerProfile?.userProfileImg, sellerName: sellerProfile?.username })}
                />
            );
        });
    };

    const styles = {
        empty: {
            paddingVertical: 10,
            fontSize: 15,
            color: 'gray'
        }
    };

    return (
        <Box w="100%" h="100%">
        <VStack>
            <HStack p="$3" w="100%" mt={25} alignItems="center">
                <Pressable onPress={navigation.goBack}>
                    <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                </Pressable>
            </HStack>
        </VStack>

        <Box
            height={boxHeight} w="100%"
            bg={colors.primary}
            position="absolute"
            zIndex={-100}
            borderBottomLeftRadius={50}
            borderBottomRightRadius={50}
        />

        <VStack>
            <Box w="100%" flex={1} zIndex={1} position="absolute" onLayout={handleViewCardLayout}>
                {sellerProfile && (
                    <ViewProfileCard
                        userProfileImg={sellerProfile.userProfileImg}
                        username={sellerProfile.username}
                        profileName={sellerProfile.userProfile || sellerProfile.username}
                        bio={sellerProfile.userBio || "I have no interesting info."}
                        userID={sellerProfile.userID}
                    />
                )}
            </Box>

            <Box p="$3" w="100%" height="100%">
                <ScrollView mt={viewCardHeight} mb={60}>
                    <Box p="$2" h="100%">
                        <VStack>
                            {/* User Listings */}
                            <HStack p={5} alignItems="center" borderRadius={30}>
                                <MaterialCommunityIcons
                                    name="view-grid"
                                    color={colors.secondary}
                                    size={25}
                                />
                                <Text fontSize={20} mt="$2" color={colors.secondary} pl={10} fontFamily={fonts.semibold}>
                                    {sellerProfile?.username}'s Listings
                                </Text>
                            </HStack>
                            <HStack space="xs" w="100%" flexWrap="wrap" justifyContent={userListings.length > 0 ? "space-between" : "center"}>
                                {userListings.length > 0 ? renderListings(userListings) : <Text style={styles.empty} fontFamily={fonts.semibold}>{sellerProfile?.username} has no active listings</Text>}
                            </HStack>

                            {/* User Biddings */}
                            <HStack p={5} alignItems="center" borderRadius={30}>
                                <MaterialCommunityIcons
                                    name="view-grid"
                                    color={colors.secondary}
                                    size={25}
                                />
                                <Text fontSize={20} mt="$2" color={colors.secondary} pl={10} fontFamily={fonts.semibold}>
                                    {sellerProfile?.username}'s Biddings
                                </Text>
                            </HStack>
                            <HStack space="xs" w="100%" flexWrap="wrap" justifyContent={userBiddings.length > 0 ? "space-between" : "center"}>
                                {userBiddings.length > 0 ? renderListings(userBiddings) : <Text style={styles.empty} fontFamily={fonts.semibold}>{sellerProfile?.username} has no active biddings</Text>}
                            </HStack>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
        </VStack>
    </Box>
    );
}
