// React components
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

// Gluestack-ui components
import {
    VStack,
    Heading,
    Box,
    ScrollView,
} from '@gluestack-ui/themed';

// Local components
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';
import colors from '../config/colors.js';

// Firebase components
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, database, getFirestore } from 'firebase/firestore';


export default function ListingsPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserProfileImg, setCurrentUserProfileImg] = useState('');

    // Add the useEffect hook to fetch the current user's profile image
    useEffect(() => {
        const auth = getAuth();
        const firestore = getFirestore();  // Corrected line

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userCollectionRef = collection(firestore, 'users');  // Corrected line
                const userQuery = query(userCollectionRef, where('userID', '==', user.uid));

                try {
                    const userQuerySnapshot = await getDocs(userQuery);

                    if (!userQuerySnapshot.empty && userQuerySnapshot.docs[0]) {
                        const userDocument = userQuerySnapshot.docs[0];
                        const userProfileImg = userDocument.data().userProfileImg || '';
                        setCurrentUserProfileImg(userProfileImg);
                    } else {
                        setCurrentUserProfileImg('');
                        console.error(`User document not found for uid: ${user.uid}`);
                    }
                } catch (error) {
                    setCurrentUserProfileImg('');
                    console.error('Error fetching user document:', error);
                }
            } else {
                setCurrentUserProfileImg('');
            }
        });

        return () => {
            if (typeof unsubscribeAuth === 'function') {
                unsubscribeAuth();
            }
        };
    }, []); // Empty dependency array to run effect only once

    // Access the selected item data from the route parameters
        //console.log('Route:', route);
    const { selectedItem, sellerImageURL } = route?.params || {};
        //console.log('Selected Item:', selectedItem);
        // console.log('Seller Image URL:', sellerImageURL)

    const listingsData = selectedItem
    ? [
        {   
            productID: selectedItem.id,
            productImage: { uri: selectedItem.listingImageURL },
            productName: selectedItem.listingName,
            productPrice: selectedItem.listingPrice,
            productDesc: selectedItem.listingDescription,
            sellerName: selectedItem.username,
            sellerID: selectedItem.sellerID,
            tags: selectedItem.listingTags.map((tag, index) => (
              <TagLabel key={index} tagName={tag} />
            )),
            
        },
    ]
    : [];

    const renderListings = () => {
      console.log('Listings Data:', listingsData);
      
      return listingsData.map((listings, index) => (
        <ListingCard
          key={index}
          productID={selectedItem.id}
          productImage={listings.productImage?.uri ? listings.productImage : { uri: 'fallback_image_url' }}
          productName={listings.productName}
          productPrice={listings.productPrice}
          productDesc={listings.productDesc}
          sellerName={listings.sellerName}
          sellerID={listings.sellerID}
          sellerImageURL={sellerImageURL}
          tags={listings.tags}
        />
      ));
    };

    
    
    const listingsRepliesData = [
        {
            replyUser: "kuromi",
            userIcon: require("../../assets/img/usericon.jpg"),
            replyText: "mine!",
            replyDate: "10/25/2023",
            replyTime:"12:58 PM"
        }, {
            replyUser: "sassag0rl",
            userIcon: require("../../assets/img/sassa.jpg"),
            replyText: "EPAL NG NAG MINE",
            replyDate: "10/25/2023",
            replyTime:"1:43 PM"
        }, 
    ];

    const renderListingsReply = () => {
        return listingsRepliesData.map((listing, index) =>
            <ReplyBox
                key={index}
                replyUser={listing.replyUser}
                userIcon={listing.userIcon}
                replyText={listing.replyText}
                replyDate={listing.replyDate}
                replyTime={listing.replyTime}
            />
        );
    }

    return (
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                <ScrollView>
                    <VStack space="xs" flexWrap="wrap">
                        {renderListings()}
                    </VStack>

                    {/* Added a comment */}
                    <VStack space="xs">
                        <CommentBox
                            posterIcon={currentUserProfileImg ? { uri: currentUserProfileImg } : require("../../assets/img/usericon.jpg")}
                            comment={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                    </VStack>
                    
                    {/* Replies */}
                    <VStack space="xs">
                        <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>Replies</Heading>
                        <VStack space="xs">
                            {renderListingsReply()}
                        </VStack>
                    </VStack>
                </ScrollView>
            </Box>
        </Box>
    );
}
