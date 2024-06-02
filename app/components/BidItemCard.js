import React, { useState, useEffect } from 'react';
import {
    HStack,
    VStack,
    Heading,
    Text,
    Box,
    Image,
} from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { useWindowDimensions } from 'react-native';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

const db = getFirestore(FIREBASE_APP);

export default function BidItemCard({ listingPrice, listingImage, listingName, remainingTime, toBidding, buttonCondition }) {
    const navigation = useNavigation();
    const [highestBid, setHighestBid] = useState(null);
    const [highestBidder, setHighestBidder] = useState(null);
    const [isImageUrl, setIsImageUrl] = useState(typeof listingImage === 'string');
    const { height } = useWindowDimensions();
    const cardHeight = height / 3;

    useEffect(() => {
        const fetchHighestBid = async () => {
            try {
                const biddingCollectionRef = collection(db, 'bidding');
                const querySnapshot = await getDocs(query(biddingCollectionRef, where('listingName', '==', listingName)));

                let maxBiddingPrice = 0;
                let userWithMaxBiddingPrice = null;

                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.biddingPrice > maxBiddingPrice) {
                        maxBiddingPrice = data.biddingPrice;
                        userWithMaxBiddingPrice = data.user;
                    }
                });

                if (maxBiddingPrice > 0) {
                    setHighestBid(maxBiddingPrice);
                    setHighestBidder(userWithMaxBiddingPrice);
                }
            } catch (error) {
                console.error('Error fetching highest bid:', error);
            }
        };

        fetchHighestBid();
    }, [listingName]);

    const truncatedListingName = listingName.length > 20 ? listingName.substring(0, 17) + '...' : listingName;

    const confirmDelete = () => {
          Alert.alert(
              "Delete Listing",
              "Are you sure you want to delete this?",
              [
                  {
                      text: "Cancel",
                      style: "cancel"
                  },
                  { 
                      text: "Delete", 
                      onPress: handleDelete,
                      style: "destructive"
                  }
              ],
              { cancelable: true }
          );
      };

    return (
        <Box p="$1" w="100%" maxHeight={cardHeight} flex={1} >
            <VStack bg={colors.white} width="100%" borderRadius={10} >
              {/* {showDeleteButton && (
                    <Button 
                        variant="solid" 
                        size="$sm" 
                        bg="red.500" 
                        onPress={confirmDelete} 
                        backgroundColor='red'
                        alignSelf="flex-end" 
                        marginRight={2} 
                        marginTop={2}
                    >
                        <Text color="black" fontSize="$md" bold>Delete</Text>
                    </Button>
                )} */}
                
                <HStack width="100%" >
                    {/* Update to listing image */}
                    
                    {isImageUrl ? (
                        <Image
                            source={{ uri: listingImage }}
                            style={{ height: "auto", width: 150 }}
                            resizeMode="cover"
                            alt="icon"
                        />
                    ) : (
                        <Text>No Image Available</Text>
                    )}
                    <VStack p="$2" flex={1}>
                        <Text fontSize="$xl" color={colors.primary} fontFamily={fonts.bold}>{truncatedListingName}</Text>
                        
                        {highestBid ? (
                            <>
                                <Text fontSize="$md" color={colors.secondary} fontFamily={fonts.regular}>
                                    Highest Bid: PHP {highestBid}
                                </Text>
                                <Text fontSize="$sm" color={colors.black} fontFamily={fonts.regular}>
                                    Highest Bidder: {highestBidder}
                                </Text>
                            </>
                        ) : (
                            <Text fontSize="$md" color={colors.secondary} fontFamily={fonts.regular}>
                                Base Price: PHP {listingPrice}
                            </Text>
                        )}
                        
                        <Text fontSize="$md" color={colors.black} fontFamily={fonts.bold}>{remainingTime}</Text>
                        {buttonCondition}
                        
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
}
