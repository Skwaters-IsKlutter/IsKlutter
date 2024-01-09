// React
import * as React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


// Gluestack UI
import {Box, ScrollView, Heading } from '@gluestack-ui/themed';

// Local Components
import SearchHeader from '../components/SearchHeader.js';
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
    const [userListings, setUserListings] = React.useState([]);

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

              // Fetch user listings
              const userListingQuery = query(collection(database, 'listings'), where('sellerID', '==', user.uid));
              const userListingQuerySnapshot = await getDocs(userListingQuery);
              const userListingData = userListingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setUserListings(userListingData);
    
              setLoadingProfile(false);
            }
          };
    
          fetchData(); // Fetch data when the screen comes into focus
        }, []) // Empty dependency array means it will only run once when the component mounts
      );

      const renderUserListings = () => {
        return userListings.map((item) => {
          const firstTag = item.listingTags && item.listingTags.length > 0 ? item.listingTags[0] : null;

          return (
            <ItemCard
                key={item.id}
                productImage={item.listingImageURL}
                productPrice={item.listingPrice}
                productName={item.listingName}
                productSeller={currentUser?.username}
                tags={firstTag}
                toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item, sellerImageURL: setProfileImg })}
            />
          );
        });
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeader userIcon={require("../../assets/img/usericon.jpg")} />
            <Box p="$6" w="100%" maxWidth="$96">
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
                    <Box bgColor="white" p={20} borderRadius={5} m={5}>
                      {/* Display user listings */}
                      <Heading lineHeight={40} fontSize="$4xl" color={colors.secondary}>
                            Your Listings
                        </Heading>
                        {renderUserListings()}
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
}
