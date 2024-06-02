import React, { useState } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, StyleSheet, LogBox } from 'react-native';
import {
    VStack,
    Box,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    HStack
} from '@gluestack-ui/themed';

import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../components/UserIcon.js'; // useUser hook
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, where, getDocs, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { database, auth } from '../../config/firebase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BackHeader from '../components/BackHeader.js';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

export default function EditProfileScreen({ route, navigation }) {
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const { username, profileName, bio, userID, userProfileImg } = route.params;
    const [newProfileName, setNewProfileName] = useState(profileName);
    const [newUsername, setNewUsername] = useState(username);
    const [newBio, setNewBio] = useState(bio);
    const [newProfileImage, setNewProfileImage] = useState(userProfileImg); // Show current image initially
    const { updateProfileImg } = useUser();

    const handleChooseImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permission to upload images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (result.canceled) {
            return;
        }
        setNewProfileImage(result.assets[0].uri);
    };

    const handleSaveProfile = async () => {
        // Check if the new username is provided
        if (!newUsername) {
            Alert.alert('Error', 'New username is required.');
            return;
        }

        // Check if the new username is already taken
        if (username !== newUsername) {
            const usersCollection = collection(database, 'users');
            const usernameQuery = query(usersCollection, where('username', '==', newUsername));
            const usernameQuerySnapshot = await getDocs(usernameQuery);

            if (!usernameQuerySnapshot.empty) {
                Alert.alert('Error', 'Username already exists. Please choose a different username.');
                return;
            }
        }

        try {
            setLoadingSave(true); // Set loading to true

            let updatedProfileData = {
                username: newUsername,
                userBio: newBio,
                userProfile: newProfileName,
            };

            let imageUrl = '';
            if (newProfileImage !== userProfileImg) { // Check if a new image has been chosen
                console.log('Attempting to upload image to Firebase Storage...');
                const storage = getStorage(); // Get the storage instance
                const imageRef = storageRef(storage, `profileImages/${userID}`); // Use storageRef with the storage instance
                const response = await fetch(newProfileImage);
                const blob = await response.blob();

                // Use uploadBytes to upload the blob data
                const uploadTask = uploadBytes(imageRef, blob);
                const snapshot = await uploadTask;

                imageUrl = await getDownloadURL(snapshot.ref);
                updatedProfileData = {
                    ...updatedProfileData,
                    userProfileImg: imageUrl,
                };
            }

            // Update the user document in Firestore with the new profile data
            const usersCollection = collection(database, 'users');
            const userQuery = query(usersCollection, where('userID', '==', userID));
            const userQuerySnapshot = await getDocs(userQuery);

            if (!userQuerySnapshot.empty) {
                const userDocRef = userQuerySnapshot.docs[0].ref;

                await updateDoc(userDocRef, updatedProfileData);

                const messagesCollection = collection(database, 'Messages');

                // Update sender username in messages where the current user is the sender
                const senderMessagesQuery = query(messagesCollection, where('sender', '==', username));
                const senderMessagesSnapshot = await getDocs(senderMessagesQuery);
                senderMessagesSnapshot.forEach(async (doc) => {
                    const messageDocRef = doc.ref;
                    await updateDoc(messageDocRef, { sender: newUsername });
                });

                // Update recipient username in messages where the current user is the recipient
                const recipientMessagesQuery = query(messagesCollection, where('recipient', '==', username));
                const recipientMessagesSnapshot = await getDocs(recipientMessagesQuery);
                recipientMessagesSnapshot.forEach(async (doc) => {
                    const messageDocRef = doc.ref;
                    await updateDoc(messageDocRef, { recipient: newUsername });
                });

                // Update the state with the new values
                route.params.setUsername(newUsername);
                route.params.setProfileName(newProfileName);
                route.params.setBio(newBio);

                // Call the updateProfileImg function from UserIcon
                updateProfileImg(newProfileImage !== userProfileImg ? imageUrl : userProfileImg);

                // Show a success message
                Alert.alert('Success', 'Profile updated successfully.');

                // Set loading back to false
                setLoadingSave(false);

                // Navigate back to the Profile screen
                navigation.navigate('Profile');
            } else {
                console.log('User document not found.');
                Alert.alert('Error', 'User document not found. Please try again.');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            Alert.alert('Error', 'Failed to update user profile. Please try again.');
        } finally {
            // Set loading back to false
            setLoadingSave(false);
        }
    };

    const handleCancel = () => {
        // Go back to the previous screen (listings page)
        navigation.goBack();
    };

    const handleDeleteAccount = async () => {
        // Show a confirmation dialog
        Alert.alert(
            'Confirm Account Deletion',
            'Are you sure you want to delete your account? This action is irreversible.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            setLoadingDelete(true);

                            // Query the users collection to get the document reference for the user
                            const usersCollection = collection(database, 'users');
                            const userQuery = query(usersCollection, where('userID', '==', userID));
                            const userQuerySnapshot = await getDocs(userQuery);
                            const user = auth.currentUser;

                            if (!userQuerySnapshot.empty) {
                                const userDocRef = userQuerySnapshot.docs[0].ref;

                                // Delete all listings where the sellerID matches the user's ID
                                const listingsCollection = collection(database, 'listings');
                                const listingsQuery = query(listingsCollection, where('sellerID', '==', userID));
                                const listingsQuerySnapshot = await getDocs(listingsQuery);

                                // Use Promise.all to delete all listings in parallel
                                await Promise.all(listingsQuerySnapshot.docs.map(async (listingDoc) => {
                                    await deleteDoc(listingDoc.ref);
                                }));

                                // Delete the user document
                                await deleteDoc(userDocRef);
                                await user.delete();

                                // Show a success message
                                Alert.alert('Account Deleted', 'Your account and associated listings have been deleted successfully.');

                                // Navigate back to the login screen
                                navigation.navigate('Login');
                            } else {
                                console.log('User document not found.');
                                Alert.alert('Error', 'User document not found. Please try again.');
                            }
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert('Error', 'Failed to delete account. Please try again.');
                        } finally {
                            // Set loading back to false
                            setLoadingDelete(false);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    return (
        //Parent box
        <Box bgColor='$white'>
            {/* <Box w="100%" h="100%" justifyContent="center" alignItems="center"> */}
            <BackHeader userIcon={require('../../assets/img/usericon.jpg')} back={navigation.goBack} headerText="Edit Profile" />
            <Box p="$6" w="100%" maxWidth="$96">

                {/* Choose Image */}
                <VStack space="xl" m={1} alignItems="center">
                    <TouchableOpacity onPress={handleChooseImage}>
                        <View style={styles.imageContainer}>
                            {newProfileImage ? (
                                <Image source={{ uri: newProfileImage }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Upload New Image</Text>
                            )}
                            
                        </View>
                        <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="camera-plus" size={24} color={colors.primary} />
                            </View>
                    </TouchableOpacity>
                </VStack>

                {/* New Profile Name Input */}
                <VStack space='xl' py="$3">
                    <FormControl size="md">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText fontFamily={fonts.bold}>New Profile Name</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField
                                placeholder="Enter new profile name"
                                onChangeText={(text) => setNewProfileName(text)}
                                value={newProfileName}
                                fontFamily={fonts.regular}
                            />
                        </Input>
                    </FormControl>
                </VStack>

                {/* New Username Input */}
                <VStack space='xl' py="$3">
                    <FormControl size="md">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText fontFamily={fonts.bold}>New Username</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField
                                type="username"
                                placeholder="Enter new username"
                                onChangeText={(text) => setNewUsername(text)}
                                value={newUsername}
                                fontFamily={fonts.regular}
                            />
                        </Input>
                    </FormControl>
                </VStack>

                {/* New Bio Input */}
                <VStack space='xl' py="$3">
                    <FormControl size="md">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText fontFamily={fonts.bold}>New Bio</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%" h={80}>
                            <InputField
                                multiline
                                maxLength={120}
                                placeholder="Enter new bio"
                                onChangeText={(text) => setNewBio(text)}
                                value={newBio}
                                fontFamily={fonts.regular}
                            />
                        </Input>
                    </FormControl>
                </VStack>

                <HStack space="sm" pt="$4" justifyContent="space-evenly" alignItems="center">
                    {/* Cancel Button */}
                    <Button size="sm" backgroundColor={colors.gray} onPress={handleCancel} disabled={loadingSave}>
                        <ButtonText fontFamily={fonts.bold}>Cancel</ButtonText>
                    </Button>

                    {/* Save Button */}
                    <Button size="sm" backgroundColor={colors.primary} onPress={handleSaveProfile} disabled={loadingSave}>
                        <ButtonText fontFamily={fonts.bold}>{loadingSave ? 'Saving...' : 'Save Edits'}</ButtonText>
                    </Button>
                </HStack>

                {/* Delete Account Button */}
                <VStack space="lg" pt="$4">
                    <Button size="sm" backgroundColor={colors.red} onPress={handleDeleteAccount} disabled={loadingDelete}>
                        <ButtonText fontFamily={fonts.bold}>{loadingDelete ? 'Deleting...' : 'Delete Account'}</ButtonText>
                    </Button>
                </VStack>

            </Box>
        </Box>
        // </Box>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: 170,
        height: 170,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 85,
        overflow: 'hidden',
    },
    iconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 5,
    },
    text: {
        color: colors.white,
        fontSize: 15,
        textAlign: 'center',
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 50,
        fontFamily: fonts.regular,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
