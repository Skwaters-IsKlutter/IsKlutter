import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, ScrollView, Heading, Text, HStack, VStack, Pressable } from '@gluestack-ui/themed';

import SearchHeader from '../components/SearchHeader.js';
import ViewProfileCard from '../components/ViewProfileCard.js';
import ItemCard from '../components/ItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import fonts from '../config/fonts.js';
import BackHeader from '../components/BackHeader.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ViewProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const [sellerProfile, setSellerProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userBiddings, setUserBiddings] = useState([]);

  useEffect(() => {
    const sellerID = route.params?.sellerID;

    if (!sellerID) {
      console.error("Seller ID is undefined in route params");
      return;
    }

    const fetchSellerProfile = async () => {
      const q = query(collection(database, 'users'), where('userID', '==', sellerID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const sellerDoc = querySnapshot.docs[0];
        const sellerDocSnapshot = await getDoc(doc(database, sellerDoc.ref.path));

        if (sellerDocSnapshot.exists()) {
          const sellerData = sellerDocSnapshot.data();
          setSellerProfile(sellerData);
        } else {
          console.error('Seller document does not exist.');
        }
      } else {
        console.error('Seller document not found.');
      }
    };

    const fetchSellerListings = async () => {
      const sellerListingQuery = query(collection(database, 'listings'), where('sellerID', '==', sellerID));
      const sellerListingQuerySnapshot = await getDocs(sellerListingQuery);
      const listings = sellerListingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const biddings = listings.filter(listing => listing.bidding === true);
      const nonBiddings = listings.filter(listing => listing.bidding === false);

      setUserListings(nonBiddings);
      setUserBiddings(biddings);
    };

    fetchSellerProfile();
    fetchSellerListings();
  }, [route.params]);

  const renderListings = (listings) => {
    return listings.map((item) => {
      const firstTag = item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null;

      return (
        <ItemCard
          key={item.id}
          productImage={item.listingImageURL}
          productPrice={item.listingPrice}
          productName={item.listingName}
          productSeller={sellerProfile?.username}
          tags={firstTag}
          toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: sellerProfile?.userProfileImg, sellerName: sellerProfile?.username })}
        />
      );
    });
  };

  return (
    <Box w="100%" h="100%">
      <VStack>
        <HStack p="$3" w="100%" mt={25} alignItems="center">
          <Pressable onPress={navigation.goBack}>
            <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
          </Pressable>
        </HStack>
      </VStack>

      <Box height="45%" w="100%" bg={colors.primary} position='absolute' zIndex={-100} borderBottomLeftRadius={50} borderBottomRightRadius={50} />

      <VStack>
        <Box w="100%" flex={1} zIndex={1} position='absolute'>
          {sellerProfile && (
            <ViewProfileCard
              userProfileImg={sellerProfile.userProfileImg}
              username={sellerProfile.username}
              profileName={sellerProfile.userProfile || sellerProfile.username}
              bio={sellerProfile.userBio || "I have no interesting info."}
              userID={sellerProfile.userID}
            />
          )}
        </Box>

        <Box p="$3" w="100%" height="100%">
          <ScrollView mt={330}>
            {/* User Listings */}
            <Text lineHeight={40} pl={20} fontSize={20} color={colors.secondary} mt={6} fontFamily={fonts.semibold}>
              {`${sellerProfile?.username}'s Listings`}
            </Text>
            <HStack space="xs" flexWrap="wrap" justifyContent="center">
              {renderListings(userListings)}
            </HStack>

            {/* User Biddings */}
            <Text lineHeight={40} pl={20} fontSize={20} color={colors.secondary} mt={6} fontFamily={fonts.semibold}>
              {`${sellerProfile?.username}'s Biddings`}
            </Text>
            <HStack space="xs" flexWrap="wrap" justifyContent="center">
              {renderListings(userBiddings)}
            </HStack>
          </ScrollView>
        </Box>
      </VStack>
    </Box>
  );
}
