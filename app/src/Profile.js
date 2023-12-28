import * as React from 'react';
import {
    Box,
    ScrollView
} from '@gluestack-ui/themed';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import SearchHeader from '../components/SearchHeader.js';
import HelloCard from '../components/ProfileHello.js'; 
import ProfileCard from '../components/ProfileCard.js';
import colors from '../config/colors.js';

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [profileName, setProfileName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [bio, setBio] = React.useState('');

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user !== null) {
                const q = query(collection(database, 'users'), where('userID', '==', user.uid));
                const querySnapshot = await getDocs(q);
                console.log('User UID:', user.uid);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userDocSnapshot = await getDoc(doc(database, userDoc.ref.path));

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        console.log('User Data:', userData);
                        setCurrentUser(userData);
                    } else {
                        console.log('User document does not exist.');
                    }
                } else {
                    console.log('User document not found.');
                }
            } else {
                setCurrentUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Box w="100%" h="100%">
            <SearchHeader userIcon={require("../../assets/img/usericon.jpg")} />
            <Box p="$6" w="100%" maxWidth="$96">
                <HelloCard username={currentUser?.username} />
                <ScrollView>
                    <ProfileCard
                        userIcon={require("../../assets/img/item.jpg")}
                        username={currentUser?.username}
                        profileName={currentUser?.userProfile || currentUser?.username}
                        bio={currentUser?.userBio || "I have no interesting info."}
                        userID={currentUser?.userID}
                        setProfileName={setProfileName}
                        setUsername={setUsername}
                        setBio={setBio}
                    />
                    <Box bgColor="white" p={20} borderRadius={5} m={5}></Box>
                </ScrollView>
            </Box>
        </Box>
    );
}
