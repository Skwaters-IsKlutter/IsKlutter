// React
import * as React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Gluestack UI
import { Box, ScrollView, Heading, HStack, VStack } from '@gluestack-ui/themed';

// Local Components
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import HelloCard from '../components/ProfileHello.js';
import ProfileCard from '../components/ProfileCard.js';
import ItemCard from '../components/ItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';


// Firebase Components
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';


export default function ProfilePage() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = React.useState(null);
    const [profileImg, setProfileImg] = React.useState('');
    const [profileName, setProfileName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [loadingProfile, setLoadingProfile] = React.useState(true);
    const [bio, setBio] = React.useState('');
    const [userListings, setUserListings] = React.useState({ myListings: [], myBiddings: [] });


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

                            // Set the userProfileImg URL
                            const userProfileImg = userData?.userProfileImg || '';
                            setProfileImg(userProfileImg);
                        } else {
                            console.log('User document does not exist.');
                        }
                    } else {
                        console.log('User document not found.');
                    }

                    // Fetch user listings where 'sellerID' is equal to user.uid and 'bidding' is false
                    const listingsQuerySnapshot = await getDocs(query(collection(database, 'listings'),
                        where('sellerID', '==', user.uid),
                        where('bidding', '==', false)
                    ));
                    const userListingData = listingsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Fetch user biddings where 'sellerID' is equal to user.uid and 'bidding' is true
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
        }, []) // Empty dependency array means it will only run once when the component mounts
    );

    const renderUserListings = () => {
        return (
            <>
                {/* My Listings */}
                <VStack>
                    <HStack
                        p={5}
                        alignItems="center"
                        borderRadius={30}
                    >
                        <MaterialCommunityIcons
                            name="view-grid"
                            color={colors.secondary}
                            size={20}
                        />
                        <Heading
                            lineHeight={40}
                            fontSize={20}
                            color={colors.secondary}
                            pl={10}
                        >
                            My Listings
                        </Heading>
                    </HStack>
                    {/* My Listings Container */}
                    <HStack space="xs" flexWrap="wrap">
                        {userListings.myListings.map(item => (
                            <ItemCard
                                key={item.id}
                                productImage={item.listingImageURL}
                                productPrice={item.listingPrice}
                                productName={item.listingName}
                                productSeller={currentUser?.username}
                                tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: profileImg, sellerName: currentUser?.username })}
                            />
                        ))}
                    </HStack>
                </VStack>

                {/* My Biddings */}
                <VStack>
                    <HStack
                        p={5}
                        alignItems="center"
                        borderRadius={30}
                    >
                        <MaterialCommunityIcons
                            name="cash-multiple"
                            color={colors.secondary}
                            size={20}
                        />
                        <Heading
                            lineHeight={40}
                            fontSize={20}
                            color={colors.secondary}
                            pl={10}
                        >
                            My Biddings
                        </Heading>
                    </HStack>
                    {/* My Biddings Container */}
                    <HStack space="xs" flexWrap="wrap">
                        {userListings.myBiddings.map(item => (
                            <ItemCard
                                key={item.id}
                                productImage={item.listingImageURL}
                                productPrice={item.listingPrice}
                                productName={item.listingName}
                                productSeller={currentUser?.username}
                                tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: profileImg, sellerName: currentUser?.username })}
                            />
                        ))}
                    </HStack>
                </VStack>
            </>
        );
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

            <Box p="$3" w="100%" flex={1}>
                <HelloCard username={currentUser?.username} />
                <ScrollView>
                    <ProfileCard
                        userProfileImg={profileImg}
                        username={currentUser?.username}
                        profileName={currentUser?.userProfile || currentUser?.username}
                        bio={currentUser?.userBio || "I have no interesting info."}
                        userID={currentUser?.userID}
                        setProfileName={setProfileName}
                        setUsername={setUsername}
                        setBio={setBio}
                        loading={loadingProfile} // Pass loading state to ProfileCard
                    />

                    <Box bgColor="white" p="$3" mt={4}>
                        <VStack>
                            <HStack p={5} alignItems="center" borderRadius={30}>
                                <MaterialCommunityIcons
                                    name="view-grid"
                                    color={colors.secondary}
                                    size={20}
                                />
                                <Heading lineHeight={40} fontSize={20} color={colors.secondary} pl={10}>
                                    My Listings
                                </Heading>
                            </HStack>
                            {/* My Listings Container */}
                            <HStack space="xs" flexWrap="wrap">
                                {userListings.myListings.map(item => (
                                    <ItemCard
                                        key={item.id}
                                        productImage={item.listingImageURL}
                                        productPrice={item.listingPrice}
                                        productName={item.listingName}
                                        productSeller={currentUser?.username}
                                        tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                        toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: profileImg, sellerName: currentUser?.username })}
                                    />
                                ))}
                            </HStack>

                            <HStack p={5} alignItems="center" borderRadius={30}>
                                <MaterialCommunityIcons
                                    name="cash-multiple"
                                    color={colors.secondary}
                                    size={20}
                                />
                                <Heading lineHeight={40} fontSize={20} color={colors.secondary} pl={10}>
                                    My Biddings
                                </Heading>
                            </HStack>
                            {/* My Biddings Container */}
                            <HStack space="xs" flexWrap="wrap">
                                {userListings.myBiddings.map(item => (
                                    <ItemCard
                                        key={item.id}
                                        productImage={item.listingImageURL}
                                        productPrice={item.listingPrice}
                                        productName={item.listingName}
                                        productSeller={currentUser?.username}
                                        tags={item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null}
                                        toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: profileImg, sellerName: currentUser?.username })}
                                    />
                                ))}
                            </HStack>
                        </VStack>
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
}  