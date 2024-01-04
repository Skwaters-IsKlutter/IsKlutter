import * as React from 'react';
import {
    Box,
    ScrollView
} from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import SearchHeader from '../components/SearchHeader.js';
import HelloCard from '../components/ProfileHello.js'; 
import ProfileCard from '../components/ProfileCard.js';
import colors from '../config/colors.js';

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [profileImg, setProfileImg] = React.useState('');
    const [profileName, setProfileName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [loadingProfile, setLoadingProfile] = React.useState(true);
    const [bio, setBio] = React.useState('');

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
    
              setLoadingProfile(false);
            }
          };
    
          fetchData(); // Fetch data when the screen comes into focus
        }, []) // Empty dependency array means it will only run once when the component mounts
      );

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
                    <Box bgColor="white" p={20} borderRadius={5} m={5}></Box>
                </ScrollView>
            </Box>
        </Box>
    );
}
