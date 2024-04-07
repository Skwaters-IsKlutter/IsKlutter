import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, VStack, HStack, Image } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export const ReplyBox = ({ replyText, replyUser, replyDate, replyTime }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState(replyText);

    const handleViewProfile = () => {
        navigation.navigate(Routes.VIEWPROFILE, { sellerID: replyUser });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const firestore = getFirestore();
                const usersCollectionRef = collection(firestore, 'users');
                const userQuery = query(usersCollectionRef, where('userID', '==', replyUser));
                const userQuerySnapshot = await getDocs(userQuery);
                
                if (!userQuerySnapshot.empty) {
                    const userData = userQuerySnapshot.docs[0].data();
                    setUserData(userData);
                } else {
                    console.log('User not found for ID:', replyUser);
                }
            } catch (error) {
                console.error('Error fetching user document:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [replyUser]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box p="$2" h="auto" bg={colors.white} flex={1}>
            <VStack space="sm" m={6}>
                <HStack justifyContent="space-between" alignItems="center">
                    <TouchableOpacity onPress={handleViewProfile}>
                        <HStack alignItems="center">
                            <Image source={{ uri: userData?.userProfileImg }} h={45} w={45} alt="icon" borderRadius={100} />
                            <Text color={colors.secondary} fontSize="$md" fontWeight="$bold" pl={5}>{userData?.username}</Text>
                        </HStack>
                    </TouchableOpacity>
                    <HStack space="sm">
                        <Text color={colors.gray} fontSize="$xs">{replyDate}</Text>
                        <Text color={colors.gray} fontSize="$xs">{replyTime}</Text>
                    </HStack>
                </HStack>
            </VStack>

            <HStack space="sm" justifyContent="center" alignItems="center">
                <ScrollView style={{ flex: 1, maxHeight: 100 }}>
                    <Box h="auto" w="100%">
                        <TextInput
                            multiline
                            value={commentText}
                            onChangeText={(text) => setCommentText(text)}
                            style={{ minHeight: 40 }}
                        />
                    </Box>
                </ScrollView>
            </HStack>
        </Box>
    );
};