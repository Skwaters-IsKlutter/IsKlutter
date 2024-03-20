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

// Firebase Components
import { getFirestore, addDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function AllBiddingsPage() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [comments, setComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [highestBidders, setHighestBidders] = useState({});

  useEffect(() => {
    const fetchListings = async () => {
      const listingsCollection = collection(db, 'listings');
      const snapshot = await getDocs(listingsCollection);
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        listingName: doc.data().listingName,
        listingPrice: doc.data().listingPrice
      }));
      setListings(listingsData);
    };
    fetchListings();

    // Subscribe to changes in listings collection
    const unsubscribe = onSnapshot(collection(db, 'listings'), (snapshot) => {
      const updatedListings = snapshot.docs.map(doc => ({
        id: doc.id,
        listingName: doc.data().listingName,
        listingPrice: doc.data().listingPrice
      }));
      setListings(updatedListings);
    });

    return unsubscribe; // Cleanup function to unsubscribe from snapshot listener
  }, []);

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

      // Get the highest bidding price and username for the current listing
      const querySnapshot = await getDocs(query(biddingCollectionRef, where('listingName', '==', listings.find(listing => listing.id === listingId).listingName)));
      let highestBiddingPrice = 0;
      let highestBidder = 'Anonymous';

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.biddingPrice > highestBiddingPrice) {
          highestBiddingPrice = data.biddingPrice;
          highestBidder = data.user;
        }
      });

      updateHighestBidder(listingId, highestBidder);

      alert(`Bid placed successfully!\nCurrent highest bidder in ${listings.find(listing => listing.id === listingId).listingName}: ${highestBidder}`);

    } catch (error) {
      alert('Input only number');
      console.error('Error placing bid:', error);
    }
  };

  return (
    <Box w="100%" h="100%">
      <Box backgroundColor={colors.primary}>
        <HStack p="$2" w="100%" mt={45} alignItems="center">
          <Pressable onPress={navigation.goBack}>
            <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
          </Pressable>
          <Heading lineHeight={50} fontSize={30} color={colors.white} ml={25} mr={150}>
            Biddings
          </Heading>
          <Pressable onPress={() => navigation.navigate(Routes.PROFILE)}>
            <UserAvatar />
          </Pressable>
        </HStack>

        <VStack>
          <HStack p="$3" w="100%" justifyContent="space-evenly">
            <Input w="90%" bg={colors.white} size="sm" borderRadius={20} left={-5} h={40}>
              <InputField
                placeholder="Search"
              />
              <InputSlot>
                <InputIcon>
                  <MaterialCommunityIcons name="magnify" color={colors.primary} size={15} right={15} />
                </InputIcon>
              </InputSlot>
            </Input>
          </HStack>
        </VStack>
      </Box>

      <Button
        borderRadius={50}
        backgroundColor={colors.secondary}
        onPress={() => navigation.navigate(Routes.ADDLISTING)}
        p={5}
        m={10}
      >
        <ButtonIcon>
          <MaterialCommunityIcons name="plus-thick" size={20} color={colors.white} />
        </ButtonIcon>
        <ButtonText pl={10}>Add item for bidding</ButtonText>
      </Button>

      <Box>
        <ScrollView>
          {listings.map(listing => (
            <Box key={listing.id}>
              <Text>
                Listing Name: {listing.listingName}, Listing Price: {listing.listingPrice}
              </Text>
              <HStack justifyContent="space-between" alignItems="center">
                <Input bg={colors.white} borderColor={colors.secondary} h={50} w="60%" zIndex={0}>
                  <InputField
                    multiline={true}
                    size="md"
                    placeholder="Place your bid Only numbers!"
                    onChangeText={text => handleCommentChange(listing.id, text)}
                  />
                </Input>
                <Button
                  variant="solid"
                  size="sm"
                  bg={colors.primary}
                  borderRadius={8}
                  ml={3}
                  mt={5}
                  onPress={() => handleBid(listing.id, comments[listing.id])}
                >
                  <Text color={colors.black} fontSize="$sm">Bid</Text>
                </Button>
              </HStack>
              <Text>
                Current highest bidder: {listing.listingName}: {highestBidders[listing.id] || 'Anonymous'}
              </Text>
            </Box>
          ))}
        </ScrollView>
      </Box>
    </Box>
  );
}