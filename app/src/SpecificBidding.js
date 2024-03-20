import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, Text, Button, Input, InputField, Heading, ButtonText, HStack, VStack, Pressable } from '@gluestack-ui/themed';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_APP } from '../../config/firebase';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function SpecificBiddingPage () {
  const navigation = useNavigation();
  const route = useRoute();
  const { selecteditem } = route.params;
  const [highestBidder, setHighestBidder] = useState('Anonymous');
  const [currentUser, setCurrentUser] = useState(null);
  const [comment, setComment] = useState('');
  const [remainingTime, setRemainingTime] = useState(4 * 3600 + 30 * 60 + 10); // Total time in seconds: 4 hours, 30 minutes, 10 seconds

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
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

  const handleBid = async () => {
    try {
      const intValue = parseInt(comment);
      if (isNaN(intValue)) {
        throw new Error('Bidding price must be a valid number.');
      }

      const biddingCollectionRef = collection(db, 'bidding');
      const username = currentUser ? await fetchUsername(currentUser.uid) : 'Anonymous';
      await addDoc(biddingCollectionRef, {
        listingName: selecteditem.listingName,
        listingPrice: selecteditem.listingPrice,
        biddingPrice: intValue,
        user: username
      });

      // Get the highest bidding price and username for the current listing
      const querySnapshot = await getDocs(query(biddingCollectionRef, where('listingName', '==', selecteditem.listingName)));
      let highestBiddingPrice = 0;
      let highestBidder = 'Anonymous';

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.biddingPrice > highestBiddingPrice) {
          highestBiddingPrice = data.biddingPrice;
          highestBidder = data.user;
        }
      });

      setHighestBidder(highestBidder);

      alert(`Bid placed successfully!\nCurrent highest bidder in ${selecteditem.listingName}: ${highestBidder}`);

    } catch (error) {
      alert('Input only number');
      console.error('Error placing bid:', error);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box width="100%">
      <Box backgroundColor={colors.primary}>
        <HStack p="$2" w="100%" mt={45} alignItems="center">
          <Pressable onPress={navigation.goBack}>
            <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
          </Pressable>
          <Heading lineHeight={20} fontSize={20} color={colors.white} ml={25}>
            {selecteditem.listingName}
          </Heading>
        </HStack>
      </Box>
      <Box>
        <VStack>
          <Box bgColor={colors.black} height={250}>
            {/* <Text>Remaining Time: {formatTime(remainingTime)}</Text> */}
          </Box>
        </VStack>
      </Box>
      <Box m={10} bgColor={colors.white}>
        <VStack p={10}>
          <Heading color={colors.primary}>{selecteditem.listingName}</Heading> 
          <Heading color={colors.secondary}>PHP {selecteditem.listingPrice}</Heading> 
          <Text>Current Highest Bidder: {highestBidder}</Text> 
          <Text>Remaining Time: {formatTime(remainingTime)}</Text> 
          <Text pt={20}>Place your bid:</Text>
          <Input bg={colors.white} borderColor={colors.secondary} h={50} zIndex={0}>
                  <InputField
                    multiline={true}
                    size="md"
                    placeholder="Place your bid Only numbers!"
                    onChangeText={text => setComment(text)}
                  />
                </Input>
        </VStack>
        <Button bgColor={colors.primary} p={5}  borderRadius={50} width="60%" onPress={handleBid}>
          <ButtonText>Bid now</ButtonText>
        </Button>
      </Box>
    </Box>
  );
};
