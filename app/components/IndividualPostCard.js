import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Heading, Text, Image,Button,ButtonIcon } from '@gluestack-ui/themed';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import colors from '../config/colors.js';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const database = getFirestore();

export default function IndividualPostCard({ userId, description, timestamp }) {
    const [username, setUsername] = useState('');
    const [userProfileImg, setUserProfileImg] = useState('');
    const isFocused = useIsFocused();

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
        <Box p="$3" w="100%" backgroundColor="$white">
                <Button
                    variant="solid"
                    size="sm"
                    backgroundColor="$red600"
                    borderRadius={8}
                    onPress={() => Alert.alert("Alert", "This is a dummy action.", [{ text: "OK" }])}
                    position="absolute"
                    top={15}
                    right={15}
                    zIndex={1}
                >
                    <ButtonIcon>
                        <MaterialCommunityIcons name="delete" size={15} color={colors.white}/>
                    </ButtonIcon>
                </Button>
            <VStack>
                <HStack space="sm" alignItems="center">
                    <Image
                        source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="User Avatar"
                    />
                    <Heading color={colors.primary} size={10} bold={true}>
                        {username}
                    </Heading>
                    <Text color={colors.gray} size="xs" bold={true}>
                    {timestamp}
                    </Text>
                </HStack>
                <Text color="black" pb="$3" size="md" mt="$3">
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}
