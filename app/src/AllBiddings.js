import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
    HStack,
    VStack,
    Heading,
    Text,
    Box,
    ScrollView,
    Button
} from '@gluestack-ui/themed';
import { getFirestore, getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Routes from '../components/constants/Routes.js';
import BidItemCard from '../components/BidItemCard';
import colors from '../config/colors.js';
import SearchHeader from '../components/SearchHeader.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function AllBiddingsPage() {
    const navigation = useNavigation();
    const [listings, setListings] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [highestBidders, setHighestBidders] = useState({});
    const [forceRender, setForceRender] = useState(false); // State to trigger re-renders

    const fetchListings = async () => {
        console.log("Fetching listings...");
        const listingsCollection = collection(db, 'listings');
        const snapshot = await getDocs(query(listingsCollection, where('bidding', '==', true)));
        const listingsData = snapshot.docs.map(doc => {
            const data = doc.data();
            const endTime = data.endTime.toDate();
            const remainingTime = endTime - new Date();
            const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
            return {
                id: doc.id,
                listingImageURL: data.listingImageURL,
                listingName: data.listingName,
                listingPrice: data.listingPrice,
                sellerID: data.sellerID,
                daysRemaining: daysRemaining
            };
        });
        const resolvedListingsData = await Promise.all(listingsData);
        setListings(resolvedListingsData.filter(listing => listing.daysRemaining > -1));
        console.log("Listings fetched:", resolvedListingsData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            console.log("Auth state changed:", user);
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const fetchBiddingData = async () => {
        console.log("Fetching bidding data...");
        const biddingCollectionRef = collection(db, 'bidding');
        const snapshot = await getDocs(biddingCollectionRef);
        const biddingData = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!biddingData[data.listingName]) {
                biddingData[data.listingName] = [];
            }
            biddingData[data.listingName].push({ user: data.user, biddingPrice: data.biddingPrice });
        });
        setBiddingData(biddingData);
        console.log("Bidding data fetched:", biddingData);
    };

    const handleBiddingClick = (listingId) => {
        console.log("Navigating to bidding page for listingId:", listingId);
        navigation.navigate(Routes.SPECIFICBIDDING, { listingId });
        setForceRender(prev => !prev); // Force re-render
    };

    const handleDeleteBidding = async (listingId) => {
        try {
            await deleteDoc(doc(db, 'listings', listingId));
            setForceRender(prev => !prev); // Force re-render
            console.log(`Deleted listing with id: ${listingId}`);
        } catch (error) {
            console.error("Error deleting listing:", error);
        }
    };

    const fetchHighestBidders = async () => {
        console.log("Fetching highest bidders...");
        const biddingCollection = collection(db, 'bidding');
        const listingIds = listings.map(listing => listing.id);

        const promises = listingIds.map(async listingId => {
            const querySnapshot = await getDocs(query(biddingCollection, where('listingId', '==', listingId)));
            let maxBiddingPrice = 0;
            let userWithMaxBiddingPrice = null;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.biddingPrice > maxBiddingPrice) {
                    maxBiddingPrice = data.biddingPrice;
                    userWithMaxBiddingPrice = data.user;
                }
            });

            return { listingId, highestBiddingPrice: maxBiddingPrice, highestBidderName: userWithMaxBiddingPrice };
        });

        const results = await Promise.all(promises);
        const highestBiddersData = {};

        results.forEach(result => {
            highestBiddersData[result.listingId] = {
                highestBiddingPrice: result.highestBiddingPrice,
                highestBidderName: result.highestBidderName
            };
        });

        setHighestBidders(highestBiddersData);
        console.log("Highest bidders fetched:", highestBiddersData);
    };

    useFocusEffect(
        useCallback(() => {
            console.log("Screen is focused");
            setForceRender(prev => !prev);
        }, [])
    );

    useEffect(() => {
        fetchListings();
        fetchBiddingData();
        fetchHighestBidders();
    }, [forceRender]);

    const renderAllBiddings = () => {
        console.log("Rendering all biddings...");
        return listings.map(listing => {
            const showDeleteButton = currentUser && currentUser.uid === listing.sellerID;

            return (
                <BidItemCard
                    key={listing.id}
                    listingImage={listing.listingImageURL}
                    listingName={listing.listingName}
                    listingPrice={listing.listingPrice}
                    remainingTime={listing.daysRemaining <= 0 ? 'Bidding has ended' : `Ends in ${listing.daysRemaining} day(s)`}
                    toBidding={() => handleBiddingClick(listing.id)}
                    highestBidder={listing.daysRemaining <= 0 && highestBidders[listing.id] ?
                        `Highest Bidder: ${highestBidders[listing.id].highestBidderName}` : ''}
                    highestBid={listing.daysRemaining <= 0 && highestBidders[listing.id] ?
                        `Bid Amount: ${highestBidders[listing.id].highestBiddingPrice}` : ''}
                    buttonCondition={listing.daysRemaining > 0 && (
                        <HStack justifyContent="space-between" alignItems="center">
                            <Button
                                variant="solid"
                                size="$sm"
                                bg={colors.primary}
                                borderRadius={8}
                                onPress={() => handleBiddingClick(listing.id)}
                            >
                                <Text color={colors.white} fontSize="$md" bold>Bid Now</Text>
                            </Button>
                        </HStack>
                    )}
                    showDeleteButton={showDeleteButton}
                    handleDelete={() => handleDeleteBidding(listing.id)}
                />
            );
        });
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeader
                userIcon={require('../../assets/img/usericon.jpg')}
                placeholder="Search in biddings"
            />

            <Box p="$5" w="100%" flex={1}>
                <VStack space="xs" pb="$2">
                    <HStack space="xs" justifyContent="space-between" alignItems="center">
                        <Heading lineHeight={50} fontSize={40} color={colors.secondary}>
                            Biddings
                        </Heading>

                        <Button borderRadius={30} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDBIDDING)} p={2}>
                            <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                            <Text pl={10} lineHeight={35}>Post</Text>
                        </Button>
                    </HStack>
                </VStack>

                <ScrollView>
                    {renderAllBiddings()}
                </ScrollView>

            </Box>
        </Box>
    );
}
