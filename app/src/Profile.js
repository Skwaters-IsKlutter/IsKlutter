// React
import * as React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



// Gluestack UI
import {Box, ScrollView, Heading, HStack } from '@gluestack-ui/themed';

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
                toListing={() => navigation.navigate(Routes.LISTINGS, { selectedItem: item })}
            />
          );
        });
    };

    return (
        <Box w="100%" h="100%">

            <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} back={navigation.goBack} />
            
            <Box p="$6" w="100%"  flex={1}>
                <HelloCard  username={currentUser?.username} />
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
                
                    <Box bgColor="white" 
                          p="$6"
                          borderRadius={5} 
                          m={5} alignItems="center" 
                          h="100%" 
                    >
                    <HStack bgColor={colors.secondary} 
                              pl={20}
                              pr={20}
                              alignItems="center"
                              borderRadius={30} >
                        <MaterialCommunityIcons 
                                  name="view-grid" 
                                  color={colors.medium} 
                                  size={20}
                        />
                        {/* Display user listings */}
                        <Heading lineHeight={40}
                                fontSize={20} 
                                color={colors.medium} 
                                pl={10}>
                                My Listings
                                
                          </Heading>
                      </HStack>

                    {/* Listing Box Container */}
                      <ScrollView>
                        <HStack space="xs" flexWrap="wrap">
                          {renderUserListings()}
                        </HStack>
                      </ScrollView>
                     
                        
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    );
}
