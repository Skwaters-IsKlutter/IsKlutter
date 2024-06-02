import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

import {
    HStack, 
    VStack,
    Text, 
    Heading,
    Box,
    ScrollView, 
    Input, 
    InputField, 
    Button, 
    Pressable
} from '@gluestack-ui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AllBidderListCard from '../components/AllBidderListCard.js';
import SpecificBidCard from '../components/SpecificBidCard.js';
import SearchHeaderBack from '../components/SearchHeaderBack.js';

import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

import colors from '../config/colors.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function SpecificBiddingPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { listingId } = route.params;
    const [listing, setListing] = useState({});
    const [biddingData, setBiddingData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [comments, setComments] = useState({});
    const [biddingprice, setBiddingPrice] = useState({})
    const [biddingAmount, setBiddingAmount] = useState({})
    const [highestBidder, setHighestBidder] = useState({});
    const [highestBiddingPrice, setHighestBiddingPrice] = useState(0);
    const [highestBidderName, sethighestBidderName] = useState('');
    const [listingImage, setListingImage] = useState(null);
    const [forceRender, setForceRender] = useState(false);  // State to force re-render


    useEffect(() => {
        console.log("Component mounted or updated.");
        const unsubscribe = onAuthStateChanged(auth, user => {
            console.log("Auth state changed:", user);
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const fetchUsername = async (userId) => {
        try {
            console.log("Fetching username for userId:", userId);
            const userCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userCollectionRef, where('userID', '==', userId)));

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                console.log("Username fetched:", userData.username);
                return userData.username;
            } else {
                console.error('User not found');
                return null;
            }
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchListingImage = async () => {
            try {
                console.log("Fetching listing image for listingId:", listingId);
                const docRef = doc(db, 'listings', listingId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const listingData = docSnap.data();
                    if (listingData && listingData.listingImageURL) {
                        console.log("Listing image fetched:", listingData.listingImageURL);
                        setListingImage(listingData.listingImageURL);
                    }
                }
            } catch (error) {
                console.error('Error fetching listing image:', error);
            }
        };
    
        fetchListingImage();
    }, [listingId]);
    

    const updateHighestBidder = (bidder, price) => {
        console.log("Updating highest bidder to:", bidder, "with price:", price);
        setHighestBidder({ bidder, price });
        setForceRender(prev => !prev);  // Force re-render
    };

    const handleBid = async (listingId, biddingAmount) => {
        try {
            console.log("Handling bid for listingId:", listingId, "with amount:", biddingAmount);
            const biddingBet = parseFloat(biddingAmount);
            if (isNaN(biddingBet)) {
                Alert.alert('Invalid Bid', 'Please enter a valid number for bidding.');
                return;
            }

            if (biddingBet < listing.listingPrice) {
                Alert.alert('Invalid Bid', 'Your bid must be higher than the listing price.');
                return;
            }

            if (biddingBet < highestBiddingPrice + 10) {
                Alert.alert('Invalid Bid', 'Your bid must be 10 higher than the current highest bid.');
                return;
            }

            const biddingCollection = collection(db, 'bidding');
            const username = currentUser ? await fetchUsername(currentUser.uid) : 'Anonymous';
            const { listingName, listingPrice } = listing;

            await addDoc(biddingCollection, {
                listingId: listingId,
                biddingPrice: biddingBet,
                user: username,
                listingName: listingName,
                listingPrice: listingPrice
            });

            updateHighestBidder(username, biddingBet);

            const querySnapshot = await getDocs(query(biddingCollection, where('listingName', '==', listingName)));
            let newHighestBiddingPrice = 0;
            let highestBidderName = '';

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.biddingPrice > newHighestBiddingPrice) {
                    newHighestBiddingPrice = data.biddingPrice;
                    highestBidderName = data.user;
                }
            });

            setHighestBiddingPrice(newHighestBiddingPrice);
            sethighestBidderName(highestBidderName);

            setListing(prevListing => ({
                ...prevListing,
                highestBidderName: highestBidderName,
                highestBiddingPrice: newHighestBiddingPrice
            }));

            console.log("Bid successful. New highest bidder:", highestBidderName, "with price:", newHighestBiddingPrice);
            Alert.alert('Bid Successful', `Your bid of ${biddingBet} has been placed successfully.`);

        } catch (error) {
            console.error('Error placing bid:', error);
            Alert.alert('Error', 'Failed to place bid. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchBiddingData = async () => {
            try {
                console.log("Fetching bidding data for listingId:", listingId);
                const biddingCollection = collection(db, 'bidding');
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

                setHighestBiddingPrice(maxBiddingPrice);
                sethighestBidderName(userWithMaxBiddingPrice);

                // Update listing state
                setListing(prevListing => ({
                    ...prevListing,
                    highestBidderName: userWithMaxBiddingPrice,
                    highestBiddingPrice: maxBiddingPrice
                }));
                console.log("Bidding data fetched. Highest price:", maxBiddingPrice, "by user:", userWithMaxBiddingPrice);
            } catch (error) {
                console.error('Error fetching bidding data:', error);
            }
        };

        fetchBiddingData();
    }, [listingId, listing, highestBidderName, highestBiddingPrice, forceRender]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                console.log("Fetching listing for listingId:", listingId);
                const listingsCollection = collection(db, 'listings');
                const querySnapshot = await getDocs(query(listingsCollection, where('key', '==', listingId)));
                if (!querySnapshot.empty) {
                    const listingData = querySnapshot.docs[0].data();
                    const { listingName, listingPrice } = listingData;
                    setListing({ listingName, listingPrice });
                    console.log("Listing data fetched:", { listingName, listingPrice });
                } else {
                    Alert.alert('Listing not found', 'The specified listing does not exist.');
                }
            } catch (error) {
                console.error('Error fetching listing data:', error);
                Alert.alert('Error', 'Failed to fetch listing data.');
            }
        };

        const fetchBiddingData = async () => {
            try {
                console.log("Fetching all bidding data for listingId:", listingId);
                const biddingCollection = collection(db, 'bidding');
                const querySnapshot = await getDocs(query(biddingCollection, where('listingId', '==', listingId)));
                const data = querySnapshot.docs.map(doc => doc.data());
                setBiddingData(data);
                console.log("All bidding data fetched:", data);
            } catch (error) {
                console.error('Error fetching bidding data:', error);
                Alert.alert('Error', 'Failed to fetch bidding data.');
            }
        };

        fetchListing();
        fetchBiddingData();
    }, [listingId, forceRender]);

    const renderSpecificBidding = () => {
        return listing && (
            <SpecificBidCard
                listingName={listing.listingName}
                listingPrice={listing.listingPrice}
                highestBidderName={highestBidderName}
                highestBiddingPrice={highestBiddingPrice}
                listingImage={listingImage}
            />
        )
    };

    const renderAllBidderList = () => {
        return biddingData.length > 0 ? (
            biddingData.map((bid, index) => (
                <AllBidderListCard
                    key={index}
                    bidder={bid.user}
                    biddingPrice={bid.biddingPrice}
                />
            ))
        ) : (
            <Text p="$3">No bids yet</Text>
        )
    };

    return (
        // Parent box
        <Box w="100%" h="100%">
            <SearchHeaderBack userIcon={require('../../assets/img/usericon.jpg')} back={navigation.goBack} />

            {/* Specific Bid Card */}
            <Box>
                <VStack space="xs">
                    {renderSpecificBidding()}
                </VStack> 
                <Box h="20%" m="$3">
                    <Heading fontSize="$xl" color={colors.secondary}>Bids</Heading>
                    <ScrollView>
                        {renderAllBidderList()}
                    </ScrollView>
                </Box>
            </Box>

            {/* Bet Input*/}
            <Box m={10} p={15} borderRadius={10} top={-60}>
                <HStack alignItems="center" justifyContent='space-around'>
                    <Input bg={colors.white} borderColor={colors.secondary} h={40} w="80%" zIndex={0}>
                        <InputField
                            multiline={true}
                            size="md"
                            value={biddingAmount}
                            placeholder="Place your bet amount in PHP"
                            onChangeText={(text) => setBiddingAmount(text)}
                        />
                    </Input>
                    <Button 
                        variant="solid"
                        size="md"
                        bg={colors.primary}
                        borderRadius={5}
                        ml={3}
                        onPress={() => handleBid(listingId, biddingAmount)}
                    >
                        <Text color={colors.white} fontSize="$md" bold='true'>Bid</Text>
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
}
