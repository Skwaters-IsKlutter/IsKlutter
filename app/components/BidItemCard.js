import React, { useState, useEffect, useCallback } from 'react';
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
import colors from '../config/colors.js';
import { useNavigation} from '@react-navigation/native';

import Routes from '../components/constants/Routes.js';
import { Pressable } from 'react-native';

import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function BidItemCard({ listingPrice, listingName,remainingTime, toBidding, highestBidder, highestBid,buttonCondition}) {
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

  return (
    <Box p="$2" >
      <VStack bg={colors.white} borderRadius={10} width="100%" height={180} >
        <HStack width="100%">
          <Box bg={colors.black} borderRadius={10} height={180} width={150} />
          <VStack p="$3" flex={1}>
            <Heading fontSize="$xl" color={colors.primary}>{listingName}</Heading>
            <Heading fontSize="$md" color={colors.secondary} p={0}>PHP {listingPrice}</Heading>
            <Heading fontSize="$sm" color={colors.black}>{remainingTime}</Heading>
            {buttonCondition} 
            <Text fontSize="$sm" color={colors.black}>{highestBidder}</Text>
            <Text fontSize="$sm" color={colors.black}>{highestBid}</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}