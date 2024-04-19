// React components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';


// Gluestack-ui components
import { HStack, VStack, Heading, Text, Box, 
    ScrollView,Input,InputField,InputSlot,
    InputIcon, Button, ButtonIcon, ButtonText,Pressable } from '@gluestack-ui/themed';


// Local components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';
import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';
import AllBidderListCard from '../components/AllBidderListCard.js';
import SpecificBidCard from '../components/SpecificBidCard.js';

// Firebase components
// Firebase Components
import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

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
            console.error('User not found');
            return null;
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          return null;
        }
      };

      const updateHighestBidder = (bidder, price) => {
        setHighestBidder({ bidder, price });
    };

    const handleBid = async (listingId, biddingAmount) => {
        try {
            const biddingBet = parseFloat(biddingAmount);
            if (isNaN(biddingBet)) {
                Alert.alert('Invalid Bid', 'Please enter a valid number for bidding.');
                return; 
            }
    
            if (biddingBet < listing.listingPrice) {
                Alert.alert('Invalid Bid', 'Your bid must be higher than the listing price.');
                return; 
            }
    
            if (biddingBet < highestBiddingPrice + 1) {
                Alert.alert('Invalid Bid', 'Your bid must be higher than the current highest bid.');
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
    
            Alert.alert('Bid Successful', `Your bid of ${biddingBet} has been placed successfully.`);
    
        } catch (error) {
            console.error('Error placing bid:', error);
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
                sethighestBidderName(userWithMaxBiddingPrice);
    
                // Update listing state
                setListing(prevListing => ({
                    ...prevListing,
                    highestBidderName: userWithMaxBiddingPrice,
                    highestBiddingPrice: maxBiddingPrice
                }));
            } catch (error) {
                console.error('Error fetching bidding data:', error);
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
                    const { listingName, listingPrice } = listingData; 
                    setListing({ listingName, listingPrice }); 
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
                const biddingCollection = collection(db, 'bidding');
                const querySnapshot = await getDocs(query(biddingCollection, where('listingId', '==', listingId)));
                const data = querySnapshot.docs.map(doc => doc.data());
                setBiddingData(data);
            } catch (error) {
                console.error('Error fetching bidding data:', error);
                Alert.alert('Error', 'Failed to fetch bidding data.');
            }
        };

        fetchListing();
        fetchBiddingData();
    }, [listingId]);


    const renderSpecificBidding = () => {
        return listing && (
            <SpecificBidCard
                listingName={listing.listingName}
                listingPrice={listing.listingPrice}
                highestBidderName={highestBidderName}
                highestBiddingPrice={highestBiddingPrice}
            />
        )};

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
            <Text>No bids yet</Text>
        )};



    
    return (
        // Parent box
        <Box w="100%" h="100%">
            {/* Header */}
            <Box bgColor={colors.primary} w="100%" h="10%">
                <HStack p="$2" w="100%" mt={25} ml={10} alignItems="center">
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} />
                    </Pressable>
                    <Text fontSize="$xl" color={colors.white} bold='true' ml={15}>Bid Now</Text>
                </HStack>  
            </Box>

            {/* Specific Bid Card */}
                <Box>
                    {renderSpecificBidding()} 
                    <Text fontSize="$xl" color={colors.secondary} bold='true' ml={15}>Bids</Text>
                        <Box h="20%" m={10}  mt={5} >
                            <ScrollView>
                                {renderAllBidderList()}
                            </ScrollView>
                        </Box> 
                </Box>


            {/* Bet Input*/}
                <Box m={10}  p={15} borderRadius={10} top={-40}>
                    <HStack justifyContent="space-between" alignItems="center" >
                         <Input bg={colors.white} borderColor={colors.secondary} h={50} w="80%" zIndex={0}>
                            <InputField
                                multiline={true}
                                size="md"
                                value={biddingAmount} 
                                placeholder="Place your bet amount."
                                onChangeText={(text) => setBiddingAmount(text)} 
                                                            
                            />
                        </Input>
                            <Button
                                variant="solid"
                                size="md"
                                bg={colors.primary}
                                borderRadius={5}
                                ml={3}
                                mt={5}
                                onPress={() => handleBid(listingId, biddingAmount)} 
                            >
                            <Text color={colors.white} fontSize="$md" bold='true'>Bid</Text>
                            </Button>
                    </HStack>
                </Box>
            </Box>     
    );
}