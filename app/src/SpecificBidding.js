import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

import {
    HStack,
    VStack,
    Text,
    Box,
    ScrollView,
    Input,
    InputField,
    Button,
    ButtonIcon,
    ButtonText
} from '@gluestack-ui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AllBidderListCard from '../components/AllBidderListCard.js';
import SpecificBidCard from '../components/SpecificBidCard.js';
import SearchHeaderBack from '../components/SearchHeaderBack.js';

import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import BackHeader from '../components/BackHeader.js';

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
    const [remainingTime, setRemainingTime] = useState('');

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

    const handleBid = async (listingId, biddingAmount) => {
        try {
            const biddingBet = parseFloat(biddingAmount);
            if (isNaN(biddingBet)) {
                Alert.alert('Invalid Bid', 'Please enter a valid number for bidding.');
                return;
            }

            if (biddingBet < listing.listingPrice + bidIncrement) {
                Alert.alert('Invalid Bid', `Your bid must be PHP ${bidIncrement} higher than the starting bid.`);
                return;
            }

            if (biddingBet < highestBiddingPrice + bidIncrement) {  // Use dynamic bidIncrement
                Alert.alert('Invalid Bid', `Your bid must be PHP ${bidIncrement} higher than the current highest bid.`);
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

            Alert.alert('Bid Successful', `Your bid of PHP ${biddingBet} has been placed successfully.`);

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
                Alert.alert("Error", "Failed to fetch bidding data.");
                throw (error);
            }
        };

        fetchBiddingData();
    }, [listingId, listing, highestBidderName, highestBiddingPrice]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const querySnapshot = await getDocs(query(listingsCollection, where('key', '==', listingId)));
                if (!querySnapshot.empty) {
                    const listingData = querySnapshot.docs[0].data();
                    const { listingName, listingPrice, bidIncrement, sellerID } = listingData;
                    setListing({ listingName, listingPrice, bidIncrement, sellerID, remainingTime });
                    setBidIncrement(bidIncrement || 10);

                    // Calculate remaining time
                    const endTimeDate = new Date(endTime.seconds * 1000); // Convert Firestore timestamp to Date
                    const now = new Date();
                    const timeDifference = endTimeDate - now;

                    if (timeDifference > 0) {
                        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        setRemainingTime(`${days} days ${hours} hours`);
                    } else {
                        setRemainingTime('Bidding has ended');
                    }
                } else {
                    Alert.alert('Listing not found', 'The specified listing does not exist.');
                }
            } catch (error) {
                throw(error);
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
    }, [listingId]);

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
        console.log("Remaining time for this bidding:", remainingTime);
        return listing && (
            <SpecificBidCard
                listingName={listing.listingName}
                listingPrice={listing.listingPrice}
                remainingTime={remainingTime}
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
            <Text p="$3" fontFamily={fonts.regular}>No bids yet</Text>
        )
    };

    return (
        <Box w="100%" h="100%">
            <BackHeader userIcon={require('../../assets/img/usericon.jpg')} back={navigation.goBack} headerText="Bid Details" />
            <Box>
                {currentUser && currentUser.uid === listing.sellerID && (
                    <Button
                        variant="solid"
                        size="sm"
                        backgroundColor="$red600"
                        borderRadius={8}
                        position="absolute"
                        top={25}
                        right={25}
                        zIndex={1}
                        onPress={handleDelete}
                    >
                        <ButtonIcon>
                            <MaterialCommunityIcons name="delete" size={15} color={colors.white} />
                        </ButtonIcon>
                    </Button>
                )}
                <VStack space="xs">
                    {renderSpecificBidding()}
                </VStack>

                <HStack alignItems="center" justifyContent='space-around'>
                    <Input bg={colors.white} borderColor={colors.secondary} h={40} w="80%" zIndex={0}>
                        <InputField
                            size="md"
                            value={biddingAmount}
                            keyboardType='numeric'
                            placeholder="Place your bet amount in PHP..."
                            onChangeText={(text) => setBiddingAmount(text)}
                            fontFamily={fonts.regular}
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
                        <ButtonText fontSize="$md" bold='true' fontFamily={fonts.bold} color={colors.white}>Bid</ButtonText>
                    </Button>
                </HStack>

                <Box maxHeight="33%" m="$3">
                    <Text fontFamily={fonts.bold} fontSize="$xl" color={colors.secondary}>Bids</Text>
                    <ScrollView>
                        {renderAllBidderList()}
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    );
}
