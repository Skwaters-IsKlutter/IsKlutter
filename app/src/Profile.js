import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect, useNavigation, } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box, ScrollView, Heading, HStack, VStack, Pressable, Text } from '@gluestack-ui/themed';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import HelloCard from '../components/ProfileHello.js';
import ProfileCard from '../components/ProfileCard.js';
import ItemCard from '../components/ItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import fonts from '../config/fonts.js';
import { useWindowDimensions } from 'react-native';

export default function ProfilePage() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = React.useState(null);
    const [profileImg, setProfileImg] = React.useState('');
    const [profileName, setProfileName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [loadingProfile, setLoadingProfile] = React.useState(true);
    const [bio, setBio] = React.useState('');
    const [userListings, setUserListings] = React.useState({ myListings: [], myBiddings: [] });
    const { height } = useWindowDimensions();
    const [profileCardHeight, setProfileCardHeight] = useState(0);

    const handleProfileCardLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        setProfileCardHeight(height);
    }, []);

    const boxHeight = profileCardHeight + 75;

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const user = auth.currentUser;
                if (user !== null) {
                    setLoadingProfile(true);
                    const q = query(collection(database, 'users'), where('userID', '==', user.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userDocSnapshot = await getDoc(doc(database, userDoc.ref.path));

                        if (userDocSnapshot.exists()) {
                            const userData = userDocSnapshot.data();
                            setCurrentUser(userData);
                            const userProfileImg = userData?.userProfileImg || '';
                            setProfileImg(userProfileImg);
                        } else {
                            console.log('User document does not exist.');
                        }
                    } else {
                        console.log('User document not found.');
                    }

                    const listingsQuerySnapshot = await getDocs(query(collection(database, 'listings'),
                        where('sellerID', '==', user.uid),
                        where('bidding', '==', false)
                    ));
                    const userListingData = listingsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    const biddingQuerySnapshot = await getDocs(query(collection(database, 'listings'),
                        where('sellerID', '==', user.uid),
                        where('bidding', '==', true)
                    ));
                    const userBiddingsData = biddingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    setUserListings({ myListings: userListingData, myBiddings: userBiddingsData });
                    setLoadingProfile(false);
                }
            };

            fetchData();
        }, [])
    );

    const styles = {
        empty: {
            paddingVertical: 10,
            fontSize: 15,
            color: 'gray'
        }
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


            <Box height={boxHeight}w="100%"
                bg={colors.secondary}
                position='absolute'
                zIndex={-100}
                borderBottomLeftRadius={50}
                borderBottomRightRadius={50} ></Box>
            <VStack>

                <Box w="100%" flex={1} zIndex={1} position='absolute'onLayout={handleProfileCardLayout} >
                    <HelloCard username={currentUser?.username} />
                    <ProfileCard
                        userProfileImg={profileImg}
                        username={currentUser?.username}
                        profileName={currentUser?.userProfile || currentUser?.username}
                        bio={currentUser?.userBio || "I have no interesting info."}
                        userID={currentUser?.userID}
                        setProfileName={setProfileName}
                        setUsername={setUsername}
                        setBio={setBio}
                        loading={loadingProfile}
                    />
                </Box>

                <Box p="$3" w="100%" height="100%"  >
                    <ScrollView mt={profileCardHeight} mb={60}>
                        <Box p="$2" h="100%">
                            <VStack>
                                <HStack p={5} alignItems="center" borderRadius={30}>
                                    <MaterialCommunityIcons
                                        name="view-grid"
                                        color={colors.secondary}
                                        size={25}
                                    />
                                    <Text fontSize={20} mt="$2" color={colors.secondary} pl={10} fontFamily={fonts.semibold}>
                                        My Listings
                                    </Text>
                                </HStack>
                                <HStack space="xs" w="100%" flexWrap="wrap" justifyContent={userListings.myListings.length > 0 ? "space-between" : "center"}>
                                    {userListings.myListings.length > 0 ? (
                                        userListings.myListings.map(item => (
                                            <ItemCard
                                                key={item.id}
                                                productImage={item.listingImageURL}
                                                productPrice={item.listingPrice}
                                                productName={item.listingName}
                                                productSeller={currentUser?.username}
                                                tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                                toListing={item.sold ? null : () => navigation.navigate(
                                                    item.isBidding ? (Routes.SPECIFICBIDDING, { listingId: item.id }) : Routes.LISTINGS, 
                                                    { 
                                                        selectedItem: item, 
                                                        sellerImageURL: profileImg, 
                                                        sellerName: currentUser?.username 
                                                    }
                                                )}
                                                sold={item.sold}
                                            />
                                        ))
                                    ) : (
                                        <Text fontFamily={fonts.bold} style={styles.empty}>This user has no active listings</Text>
                                    )}
                                </HStack>


                                <HStack p={5} alignItems="center" borderRadius={30}>
                                    <MaterialCommunityIcons
                                        name="cash-multiple"
                                        color={colors.secondary}
                                        size={25}
                                    />
                                    <Text fontSize={20} mt="$2" color={colors.secondary} pl={10} fontFamily={fonts.semibold}>
                                        My Biddings
                                    </Text>
                                </HStack>
                                <HStack space="xs" flexWrap='wrap' justifyContent={userListings.myBiddings.length > 0 ? "space-between" : "center"}>
                                    {userListings.myBiddings.length > 0 ? (
                                        userListings.myBiddings.map(item => (
                                            <ItemCard
                                                key={item.id}
                                                productImage={item.listingImageURL}
                                                productPrice={item.listingPrice}
                                                productName={item.listingName}
                                                productSeller={currentUser?.username}
                                                tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                                toListing={() => navigation.navigate(Routes.SPECIFICBIDDING, { listingId: item.id })}
                                                sold={item.sold}
                                            />
                                        ))
                                    ) : (
                                        <HStack justifyContent='center'>
                                            <Text fontFamily={fonts.semibold} style={styles.empty}>This user has no active biddings</Text>
                                        </HStack>
                                    )}
                                </HStack>
                            </VStack>
                        </Box>
                    </ScrollView>
                </Box>
            </VStack>
        </Box>
    );
}
