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
} from '@gluestack-ui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AllBidderListCard from '../components/AllBidderListCard.js';
import SpecificBidCard from '../components/SpecificBidCard.js';
import SearchHeaderBack from '../components/SearchHeaderBack.js';

import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
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
    const [biddingAmount, setBiddingAmount] = useState('');
    const [highestBidderName, setHighestBidderName] = useState('');
    const [highestBiddingPrice, setHighestBiddingPrice] = useState(0);
    const [listingImage, setListingImage] = useState(null);
    const [bidIncrement, setBidIncrement] = useState(10); 
    const [forceRender, setForceRender] = useState(false);  

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    const fetchUsername = async (userId) => {
        try {
            const userCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(query(userCollectionRef, where('userID', '==', userId)));

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                return userData.username;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        const fetchListingImage = async () => {
            try {
                const docRef = doc(db, 'listings', listingId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const listingData = docSnap.data();
                    if (listingData && listingData.listingImageURL) {
                        setListingImage(listingData.listingImageURL);
                    }
                }
            } catch (error) {
                // Handle error
            }
        };
    
        fetchListingImage();
    }, [listingId]);

    const updateHighestBidder = (bidder, price) => {
        setForceRender(prev => !prev);  // Force re-render
    };

    const handleBid = async (listingId, biddingAmount) => {
        try {
            const biddingBet = parseFloat(biddingAmount);
            if (isNaN(biddingBet)) {
                Alert.alert('Invalid Bid', 'Please enter a valid number for bidding.');
                return;
            }

            if (biddingBet < listing.listingPrice + bidIncrement) {
                Alert.alert('Invalid Bid', `Your bid must be ${bidIncrement} higher than the starting bid.`);
                return;
            }

            if (biddingBet < highestBiddingPrice + bidIncrement) {  // Use dynamic bidIncrement
                Alert.alert('Invalid Bid', `Your bid must be ${bidIncrement} higher than the current highest bid.`);
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
            setHighestBidderName(highestBidderName);

            setListing(prevListing => ({
                ...prevListing,
                highestBidderName: highestBidderName,
                highestBiddingPrice: newHighestBiddingPrice
            }));

            Alert.alert('Bid Successful', `Your bid of ${biddingBet} has been placed successfully.`);

        } catch (error) {
            Alert.alert('Error', 'Failed to place bid. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchBiddingData = async () => {
            try {
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
                setHighestBidderName(userWithMaxBiddingPrice);

                setListing(prevListing => ({
                    ...prevListing,
                    highestBidderName: userWithMaxBiddingPrice,
                    highestBiddingPrice: maxBiddingPrice
                }));
            } catch (error) {
                // Handle error
            }
        };

        fetchBiddingData();
    }, [listingId, listing, highestBidderName, highestBiddingPrice, forceRender]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const querySnapshot = await getDocs(query(listingsCollection, where('key', '==', listingId)));
                if (!querySnapshot.empty) {
                    const listingData = querySnapshot.docs[0].data();
                    const { listingName, listingPrice, bidIncrement, sellerID } = listingData;
                    setListing({ listingName, listingPrice, bidIncrement, sellerID });
                    setBidIncrement(bidIncrement || 10);
                } else {
                    Alert.alert('Listing not found', 'The specified listing does not exist.');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch listing data.');
            }
        };

        const fetchBiddingData = async () => {
            try {
                const biddingCollection = collection(db, 'bidding');
                const querySnapshot = await getDocs(query(biddingCollection, where('listingId', '==', listingId)));
                const data = querySnapshot.docs.map(doc => doc.data());
                setBiddingData(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch bidding data.');
            }
        };

        fetchListing();
        fetchBiddingData();
    }, [listingId, forceRender]);

    const handleDelete = async () => {
        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const listingRef = doc(db, 'listings', listingId);
                            await deleteDoc(listingRef);
                            Alert.alert('Deleted', 'The listing has been deleted.');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete the listing. Please try again later.');
                        }
                    }
                }
            ]
        );
    };

    const renderSpecificBidding = () => {
        return listing && (
            <SpecificBidCard
                listingName={listing.listingName}
                listingPrice={listing.listingPrice}
                highestBidderName={highestBidderName}
                highestBiddingPrice={highestBiddingPrice}
                listingImage={listingImage}
                bidIncrement={bidIncrement}
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
        <Box w="100%" h="100%">
            <SearchHeaderBack userIcon={require('../../assets/img/usericon.jpg')} back={navigation.goBack} />

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

            {currentUser && currentUser.uid === listing.sellerID && (
                <Button
                    position="absolute"
                    top={10}
                    left={10}
                    onPress={handleDelete}
                >
                    <MaterialCommunityIcons name="delete" size={20} color={colors.black} />
                </Button>
            )}

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
                        <Text color={colors.black} fontSize="$md" bold='true'>Bid</Text>
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
}
