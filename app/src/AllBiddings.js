import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


// Gluestack UI
import { HStack, VStack, Heading, Text, Box, ScrollView,Input,InputField,InputSlot,InputIcon, Button, ButtonIcon, ButtonText,Pressable } from '@gluestack-ui/themed';


// Local Components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeader from '../components/SearchHeader.js';
import Routes from '../components/constants/Routes.js';

import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';

import BidItemCard from '../components/BidItemCard.js';
// Firebase Components
import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';
import { list } from 'firebase/storage';
import { Alert } from 'react-native';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function AllBiddingsPage() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [comments, setComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [highestBidders, setHighestBidders] = useState({});
  const [biddingData, setBiddingData] = useState({});


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
  
    // // Subscribe to changes in listings collection
    // const unsubscribe = onSnapshot(collection(db, 'listings'), (snapshot) => {
    //   const updatedListings = snapshot.docs.map(doc => (
    //     id: doc.id,
    //     listingName: doc.data().listingName,
    //     listingPrice: doc.data().listingPrice
    //   }));
    //   setListings(updatedListings);
    // });
  
    // return unsubscribe; // Cleanup function to unsubscribe from snapshot listener
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

  const handleBiddingClick = (listingId) => {
    navigation.navigate(Routes.SPECIFICBIDDING, { listingId });
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
  
	const renderAllBiddings = () => {
		return listings.map(listing => (
			<BidItemCard
				key={listing.id}
        listingName={listing.listingName}
        listingPrice={listing.listingPrice}
        remainingTime={listing.daysRemaining}
				toBidding={onPress=() => handleBiddingClick(listing.id)}
			/>
		));
	};

  

  return (
    <Box w="100%" h="100%">
      <SearchHeader
				// userIcon={require('../../assets/img/usericon.jpg')}
				placeholder="Search in biddings"
				// search={searchInput}
				// onSearchChange={handleSearchChange}
			/>

			<Box p="$5" w="100%"  flex={1}>
				<VStack space="xs" pb="$2">
					<HStack space="xs" justifyContent="space-between" alignItems="center">
						<Heading lineHeight={50} fontSize={40} color={colors.secondary}>
							Biddings
						</Heading>


            <Button
              borderRadius={50}
              backgroundColor={colors.secondary}
              onPress={() => Alert.alert('Alert', 'This is a dummy action.')}
              p={5}
              m={5}
              
            >
              <ButtonIcon>
                <MaterialCommunityIcons name="plus-thick" size={20} color={colors.white} />
              </ButtonIcon>
              <ButtonText pl={10}>Add item to Bid</ButtonText>
            </Button>
          </HStack>

     
        <ScrollView>
          {renderAllBiddings()}
        </ScrollView>
      </VStack>
    </Box>
    </Box>
  );
}


