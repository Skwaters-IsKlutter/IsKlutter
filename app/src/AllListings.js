// React
import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Gluestack UI
import { HStack, VStack, Heading, Box, ScrollView, Button, ButtonIcon, ButtonText } from '@gluestack-ui/themed';


// Local Components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';

// Firebase Components
import { collection, getDocs, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';

export default function AllListingsPage({ key }) {
  const navigation = useNavigation();
  const [allListingsData, setAllListingsData] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      const unsubscribeListings = onSnapshot(collection(database, 'listings'), (querySnapshot) => {
        const listingsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Fetch and update productSeller for each listing
        const updatedListingsData = Promise.all(
            listingsData.map(async (item) => {
              const sellerID = item.sellerID;
          
              if (sellerID) {
                try {
                  const userDocRef = collection(database, 'users');
                  const userQuery = query(userDocRef, where('userID', '==', sellerID));
                  const userQuerySnapshot = await getDocs(userQuery);
          
                  if (!userQuerySnapshot.empty && userQuerySnapshot.docs[0]) {
                    const userDocument = userQuerySnapshot.docs[0];
                    const sellerUsername = userDocument.data().username;
          
                    // Update the productSeller directly in the listings collection
                    const listingsDocRef = doc(collection(database, 'listings'), item.id); // Use doc function to create DocumentReference
                    await updateDoc(listingsDocRef, { productSeller: sellerUsername });
          
                    // Return the updated item
                    return {
                      ...item,
                      username: sellerUsername,
                    };
                  } else {
                    console.error(`User document not found for sellerID: ${sellerID}`);
                    return item; // Return the original item if user document not found
                  }
                } catch (error) {
                  console.error('Error fetching user document:', error);
                  return item; // Return the original item in case of an error
                }
              }
          
              return item; // Return the original item if sellerID is missing
            })
          );
          

        // Update the state with the new data
        updatedListingsData.then((updatedData) => setAllListingsData(updatedData));
      });

      return () => {
        // Cleanup function to detach the listener when the component unmounts
        if (typeof unsubscribeListings === 'function') {
          unsubscribeListings();
        }
      };
    }, []) // Empty dependency array to run effect only once
  );

  const handleSearchChange = (text) => {
    setSearchInput(text);
  };

  const filteredListings = allListingsData.filter((item) => {
    const lowerCaseSearch = searchInput.toLowerCase();
    const listingName = item.listingName.toLowerCase();
    const username = item.username.toLowerCase();
    return listingName.includes(lowerCaseSearch) || username.includes(lowerCaseSearch);
  });

  const renderAllListings = () => {
    return filteredListings.map((item) => {
      const firstTag = item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null;

      return (
        <ItemCard
          key={item.id}
          productImage={item.listingImageURL}
          productPrice={item.listingPrice}
          productName={item.listingName}
          productSeller={item.username}
          sellerID={item.sellerID}
          tags={firstTag}
          toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item })}
        />
      );
    });
  };

  return (
    // Parent box
    <Box w="100%" h="100%">
      {/* Search Bar */}
      <SearchHeader 
        userIcon={require("../../assets/img/usericon.jpg")} 
        search={searchInput}
        onSearchChange={handleSearchChange}
      />

      <Box p="$6" w="100%" maxWidth="$96" flex={1}>
        {/* Listings Label and post button */}
        <VStack space="xs" pb="$2">
          <HStack space="xs" justifyContent="space-between" alignItems="center">
            <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>
              Listings
            </Heading>
            <Button
              borderRadius={8}
              backgroundColor={colors.secondary}
              onPress={() => navigation.navigate(Routes.ADDLISTING)}
            >
              <ButtonIcon>
                <MaterialCommunityIcons name="post" size={15} color={colors.white} />
              </ButtonIcon>
              <ButtonText>Post</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {/* Listing Box Container */}
        <ScrollView>
          <HStack space="xs" flexWrap="wrap" justifyContent="center">
            {renderAllListings()}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
}
