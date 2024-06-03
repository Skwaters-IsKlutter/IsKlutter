import React, { useState } from 'react';
import { HStack, VStack, Heading, Box, ScrollView, Button, ButtonIcon, ButtonText, Text } from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth } from 'firebase/auth';
import SearchHeader from '../components/SearchHeader.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import fonts from '../config/fonts.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function CommunityPage() {
    const navigation = useNavigation();
    const [description, setDescription] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUserData = async () => {
        try {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchUserData, 1000);
                return;
            }
            const currentUser = auth.currentUser;
            const userCollection = collection(db, 'users');
            const querySnapshot = await getDocs(query(userCollection, where('userID', '==', currentUser.uid)));
            querySnapshot.forEach((doc) => {
                setUsername(doc.data().username);
            });
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const fetchAllCommunityPosts = async () => {
        try {
            const forumCollection = collection(db, 'forum');
            const userCollection = collection(db, 'users');
            const querySnapshot = await getDocs(forumCollection);
            const userData = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const userID = data.userID;
                const userSnapshot = await getDocs(query(userCollection, where('userID', '==', userID)));
                let username = "Unknown";

                if (!userSnapshot.empty) {
                    username = userSnapshot.docs[0].data().username;
                }

                const userDataObj = {
                    key: doc.id,
                    description: data.description,
                    userID: data.userID,
                    username: username,
                    timeposted: data.timestamp,
                    hasImage: data.hasImage,
                    userProfileImg: data.userProfileImg
                };
                userData.push(userDataObj);
            }

            setDescription(userData);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useFocusEffect(() => {
        fetchUserData();
        fetchAllCommunityPosts();
    });

    const renderAllCommunityPosts = () => {
        const sortedDescription = description.slice().sort((a, b) => b.timeposted - a.timeposted);
        const filteredPosts = sortedDescription.filter(post =>
            post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredPosts.length === 0) {
            return <Text style={styles.endOfResults} fontFamily={fonts.semibold}>No Results Found</Text>;
        }

        return (
            <>
                {filteredPosts.map((userData, index) => (
                    <PostCard
                        key={index}
                        userId={userData.userID}
                        posterIcon={userData.userProfileImg}
                        description={userData.description}
                        timestamp={userData.timeposted ? userData.timeposted.toDate().toLocaleString() : "N/A"}
                        hasImage={userData.hasImage}
                        toIndividualPost={() => navigation.navigate(Routes.INDIVIDUALPOST, { selectedPost: userData })}
                    />
                ))}
                <Text style={styles.endOfResults} fontFamily={fonts.semibold}>End of Results</Text>
            </>
        );
    }

    const styles = {
        endOfResults: {
            textAlign: 'center',
            paddingVertical: 20,
            fontSize: 18,
            color: 'gray'
        }
    };

    return (
        <Box w="100%" h="100%">
            <SearchHeader
                userIcon={require('../../assets/img/usericon.jpg')}
                placeholder="Search in community"
                onSearchChange={setSearchQuery}
            />

            <Box p="$5" w="100%" flex={1}>
                {/* <VStack space="xs" pb="$2"> */}
                    {/* <Heading lineHeight={40} fontSize={40} color={colors.secondary}>
                        Community
                    </Heading> */}

                    {/* <PostBox /> */}
                    <VStack space="xs" pb="$2">
                    <HStack space="xs" justifyContent="space-between" alignItems="center">
                        <Text lineHeight={50} fontSize={40} color={colors.secondary} fontFamily={fonts.semibold} letterSpacing={-4}>
                            Community
                        </Text>

                        <Button borderRadius={30} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDPOST)} p={2}>
                            <ButtonIcon>
                                <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                            </ButtonIcon>
                            <ButtonText mt={2} p="$2" line fontSize="$lg" fontFamily={fonts.semibold} alignItems='center'>Post</ButtonText>
                        </Button>
                    </HStack>
                </VStack>
                    

                    <ScrollView height="80%">
                        <VStack>
                            {renderAllCommunityPosts()}
                        </VStack>
                    </ScrollView>
                {/* </VStack> */}
            </Box>
        </Box>
    )
}
