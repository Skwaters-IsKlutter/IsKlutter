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
    const [listing, setListing] = useState(null); // State to hold the fetched listing
    const [biddingData, setBiddingData] = useState([]); // State to hold the fetched bidding data
    const [currentUser, setCurrentUser] = useState(null);
    const [comments, setComments] = useState({});


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

      const updateHighestBidder = (listingId, bidder) => {
        setHighestBidders(prevState => ({
          ...prevState,
          [listingId]: bidder
        }));
      };

      const handleCommentChange = (listingId, value) => {
        const intValue = parseInt(value);
        if (!isNaN(intValue) || value === '') {
          setComments(prevState => ({
            ...prevState,
            [listingId]: isNaN(intValue) ? '' : intValue.toString()
          }));
        }
      };


      const handleBid = async (listingId, biddingPrice) => {
        try {
          const intValue = parseInt(biddingPrice);
          if (isNaN(intValue)) {
            throw new Error('Bidding price must be a valid number.');
          }
      
          const biddingCollectionRef = collection(db, 'bidding');
          const username = currentUser ? await fetchUsername(currentUser.uid) : 'Anonymous';
          await addDoc(biddingCollectionRef, {
            listingName: listings.find(listing => listing.id === listingId).listingName,
            listingPrice: listings.find(listing => listing.id === listingId).listingPrice,
            biddingPrice: intValue,
            user: username
          });
      
          // Get the highest bidding price for the current listing
          const querySnapshot = await getDocs(query(biddingCollectionRef, where('listingName', '==', listings.find(listing => listing.id === listingId).listingName)));
          let highestBiddingPrice = 0;
          let highestBidder = '';
      
          querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.biddingPrice > highestBiddingPrice) {
              highestBiddingPrice = data.biddingPrice;
              highestBidder = data.user;
            }
          });
      
          // Update the minimum bid amount to be the highest bidding price plus 1
          const minimumBid = highestBiddingPrice + 1;
      
          // Display alert if the entered bid amount is less than the minimum bid amount
          if (intValue < minimumBid) {
            const endTime = listings.find(listing => listing.id === listingId).endTime;
            const remainingTime = endTime - new Date();
            const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
            alert(`Minimum bid must be ${minimumBid}. Remaining time: ${daysRemaining} days`);
            return; // Stop execution if the bid is below the minimum
          } 
          
          else {
            alert(`Bid placed successfully!`);
          }
        } catch (error) {
          alert('Input only number');
          console.error('Error placing bid:', error);
        }
      };
  
      
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingsCollection = collection(db, 'listings');
                const querySnapshot = await getDocs(query(listingsCollection, where('key', '==', listingId)));
                if (!querySnapshot.empty) {
                    const listingData = querySnapshot.docs[0].data();
                    setListing(listingData);
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



    
    return (
        // Parent box
        <Box w="100%" h="100%">
            <Box bgColor={colors.primary} w="100%" h="12%">
                <HStack p="$2" w="100%" mt={30} ml={10} alignItems="center" >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} />
                    </Pressable>
                </HStack>  
            </Box>

            {/* Display the listingId */}
            {/* <Box w="100%" h="8%" mt={10}>
                <Text>ID: {listingId}</Text>
            </Box> */}

            {/* Image  */}
            <Box bgColor='$black' w="100%" h="30%">
                
            </Box>

            {/* Specific Bid Card */}
            <Box m={10} bg={colors.white} p={15} borderRadius={10}>
                {/* Display the listing name and price if available */}
                <Box>
                    {listing && (
                        <VStack>
                            <Heading color={colors.primary}>{listing.listingName}</Heading>
                            <Text fontSize="$md" color={colors.black} bold='true'>Bidding Price: {listing.listingPrice}</Text>
                        </VStack>
                    )}
                </Box>
       
                  <Box mt={10}>
                    <Text fontSize="$sm" color={colors.black} bold='true'>All bidders and their corresponding bidding prices:</Text>
                    {biddingData.length > 0 ? (
                        biddingData.map((bid, index) => (
                            <Text key={index}>
                                Bidder: {bid.user}, Bidding Price: {bid.biddingPrice}
                            </Text>
                        ))
                    ) : (
                        <Text>No bids yet</Text>
                    )}
                  </Box>

                  <HStack justifyContent="space-between" alignItems="center" mt={10}>
                    <Input bg={colors.white} borderColor={colors.secondary} h={50} w="80%" zIndex={0}>
                      <InputField
                        multiline={true}
                        size="md"
                        placeholder="Place your bid Only numbers!"
                        onChangeText={text => handleCommentChange(listing.id, text)}
                      />
                    </Input>
                    <Button
                      variant="solid"
                      size="md"
                      bg={colors.primary}
                      borderRadius={5}
                      ml={3}
                      mt={5}
                      onPress={() => handleBid(listing.id, comments[listing.id])}
                    >
                      <Text color={colors.white} fontSize="$md" bold='true'>Bid</Text>
                    </Button>
                  </HStack>
            </Box>
            
        </Box>
    );
}