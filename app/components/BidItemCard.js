import React, { useState, useEffect } from 'react';
import {
    HStack,
    VStack,
    Heading,
    Text,
    Box,
    Image,
} from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { useNavigation } from '@react-navigation/native';
import Routes from '../components/constants/Routes.js';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';

const db = getFirestore(FIREBASE_APP);

export default function BidItemCard({ listingPrice, listingImage, listingName, remainingTime, toBidding, buttonCondition }) {
    const navigation = useNavigation();
    const [highestBid, setHighestBid] = useState(null);
    const [highestBidder, setHighestBidder] = useState(null);
    const [isImageUrl, setIsImageUrl] = useState(typeof listingImage === 'string');

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

    return (
        <Box p="$2" flex={1}>
            <VStack bg={colors.white} borderRadius={10} width="100%" height="auto">
                
                <HStack width="100%">
                    {/* Update to listing image */}
                    
                    {isImageUrl ? (
                        <Image
                            source={{ uri: listingImage }}
                            style={{ height: 200, width: 150, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                            resizeMode="cover"
                            alt="icon"
                        />
                    ) : (
                        <Text>No Image Available</Text>
                    )}
                    <VStack p="$3" flex={1}>
                        <Heading fontSize="$2xl" color={colors.primary} letterSpacing={-1}>{listingName}</Heading>
                        
                        {highestBid ? (
                            <>
                                <Heading fontSize="$md" color={colors.secondary}>
                                    Highest Bid: PHP {highestBid}
                                </Heading>
                                <Heading fontSize="$sm" color={colors.black}>
                                    Highest Bidder:{highestBidder}
                                </Heading>
                            </>
                        ) : (
                            <Heading fontSize="$md" color={colors.secondary}>
                                Base Price: PHP {listingPrice}
                            </Heading>
                        )}
                        
                        <Heading fontSize="$md" color={colors.black}>{remainingTime}</Heading>
                        {buttonCondition}
                        
                    </VStack>
                </HStack>
            </VStack>
        </Box>
    );
}
