import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Heading, Text, Image,Button,ButtonIcon } from '@gluestack-ui/themed';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';
import { useIsFocused } from '@react-navigation/native';
import colors from '../config/colors.js';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const getCurrentUserID = () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
        return currentUser.uid;
    } else {
        return null;
    }
}

export default function IndividualPostCard({ postKey, userId, description, timestamp }) {
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const currentUserId = getCurrentUserID();

    const isCurrentUserPost = () => {
        return userId === currentUserId;
    }

    const onDelete = async (postKey) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(database, 'forum', postKey));
                            
                            const commentsQuery = query(collection(database, 'CommunityComment'), where('postKey', '==', postKey));
                            const commentsSnapshot = await getDocs(commentsQuery);
                            commentsSnapshot.forEach(async (commentDoc) => {
                                await deleteDoc(commentDoc.ref);
                            });

                            Alert.alert("Success", "Post deleted successfully.", [{ text: "OK" }])
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const fetchUserData = async () => {
        try {
            const userCollection = collection(database, 'users');
            const userQuery = query(userCollection, where('userID', '==', userId));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                setUsername(userData.username);
                setUserProfileImg(userData.userProfileImg);
            } else {
                console.error('User document not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    useEffect(() => {
        if (isFocused) {
            console.log('Focusing Individual Post Card');
            fetchUserData();
        }
    }, [isFocused]);

    return (
        <Box p="$1" w="100%">
                {isCurrentUserPost() && (
                    <Button
                        variant="solid"
                        size="sm"
                        backgroundColor="$red600"
                        borderRadius={8}
                        onPress={() => onDelete(postKey)}
                        position="absolute"
                        top={15}
                        right={15}
                        zIndex={1}
                    >
                        
                        <ButtonIcon>
                            <MaterialCommunityIcons name="delete" size={15} color={colors.white}/>
                        </ButtonIcon>
                    </Button>
                )}
            <VStack>
                <HStack space="sm" alignItems="center">
                    <Image
                        source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="User Avatar"
                    />
                    <VStack>
                        <Heading color={colors.primary} size={10} bold={true}>
                            {username}
                        </Heading>
                        <Text color={colors.gray} size="xs" bold={true}>
                        {timestamp}
                        </Text>
                    </VStack>
                </HStack>
                <Text color="black" pb="$3" size="md" mt="$3" textAlign='justify'>
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}
