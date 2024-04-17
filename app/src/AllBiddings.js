import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { 
    HStack, 
    VStack, 
    Heading, 
    Text, 
    Box, 
    ScrollView, 
    Input, 
    InputField,
    Button, 
    ButtonIcon, 
    ButtonText } from '@gluestack-ui/themed';

import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
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
    const [comments, setComments] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [highestBidders, setHighestBidders] = useState({});
    const [biddingData, setBiddingData] = useState({});
    const [highestBiddingPrice, setHighestBiddingPrice] = useState(0);
    const [highestBidderName, sethighestBidderName] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            const listingsCollection = collection(db, 'listings');
            const snapshot = await getDocs(query(listingsCollection, where('bidding', '==', true)));
            const listingsData = snapshot.docs.map(async doc => {
                const data = doc.data();
                const endTime = data.endTime.toDate(); // Convert Firestore Timestamp to JavaScript Date object
                const remainingTime = endTime - new Date(); // Calculate remaining time in milliseconds
                const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24)); // Convert remaining time to days
                return {
                    id: doc.id,
                    listingName: data.listingName,
                    listingPrice: data.listingPrice,
                    daysRemaining: daysRemaining
                };
            });
            const resolvedListingsData = await Promise.all(listingsData);
            setListings(resolvedListingsData);
        };
        fetchListings();
    }, []);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchBiddingData = async () => {
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
        };
        fetchBiddingData();
    }, []);

    const handleBiddingClick = (listingId) => {
      navigation.navigate(Routes.SPECIFICBIDDING, { listingId });
    };
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

    useEffect(() => {
      const fetchHighestBidders = async () => {
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
      };
  
      fetchHighestBidders();
  }, [listings]);
  
  const renderAllBiddings = () => {
    return listings.map(listing => (
      <BidItemCard
        key={listing.id}
        listingName={listing.listingName}
        listingPrice={listing.listingPrice}
        remainingTime={listing.daysRemaining <= 0 ? 'Bidding has ended' : `Ends in ${listing.daysRemaining} days`}
        toBidding={() => handleBiddingClick(listing.id)}
        highestBidder={listing.daysRemaining <= 0 && highestBidders[listing.id] ? 
          `Highest Bidder: ${highestBidders[listing.id].highestBidderName}` : ''}
        highestBid={listing.daysRemaining <= 0 && highestBidders[listing.id] ? 
          `Bid Amount: ${highestBidders[listing.id].highestBiddingPrice}` : ''}
        buttonCondition={listing.daysRemaining >= 0 && ( 
          <HStack justifyContent="space-between" alignItems="center">
              <Button
                  variant="solid"
                  size="$sm"
                  bg={colors.primary}
                  borderRadius={8}
                  top={-20}
                  onPress={() => handleBiddingClick(listing.id)} // Pass the listing id to handleBiddingClick
              >
                  <Text color={colors.black} fontSize="$sm">Bid Now!</Text>
              </Button>
          </HStack>
      )}
      />
    ));
  };

  
    

    return (
        <Box w="100%" h="100%">
            <SearchHeader
                userIcon={require('../../assets/img/usericon.jpg')}
                        placeholder="Search in biddings"
                // search={searchInput}
                // onSearchChange={handleSearchChange}
              />

            <Box p="$5" w="100%" maxWidth="$96" flex={1}>
              <VStack space="xs" pb="$2">
                <HStack space="xs" justifyContent="space-between" alignItems="center">
                  <Heading lineHeight={50} fontSize={40} color={colors.secondary}>
                    Biddings
                  </Heading>

                <Button borderRadius={30} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDLISTING)} p={2}>
                  <ButtonIcon>
                    <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                  </ButtonIcon>
                  <ButtonText pl={10} lineHeight={35}>Post</ButtonText>
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