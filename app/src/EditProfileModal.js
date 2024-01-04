import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image,TouchableOpacity,StyleSheet } from 'react-native';
import {
  VStack,
  Heading,
  Box, 
  Button, 
  ButtonText, 
  FormControl, 
  FormControlLabel, 
  FormControlError, 
  FormControlErrorText, 
  FormControlLabelText, 
  FormControlHelper, 
  FormControlHelperText, 
  FormControlErrorIcon, 
  Input, 
  InputField,
  Pressable
} from '@gluestack-ui/themed';

import { useUser } from '../components/UserIcon.js'; // useUser hook
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, where, getDocs, query, updateDoc, doc } from 'firebase/firestore';
import { database } from '../../config/firebase';
import colors from '../config/colors.js';

export default function EditProfileScreen({ route, navigation,back }) {
  const [loading, setLoading] = useState(false);
  const {username, profileName, bio, userID, setProfileName, setUsername, setBio } = route.params;
  const [newProfileName, setNewProfileName] = useState(profileName);
  const [newUsername, setNewUsername] = useState(username);
  const [newBio, setNewBio] = useState(bio);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const {userProfileImg, updateProfileImg } = useUser();

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
      setLoading(true); // Set loading to true
  
      let imageUrl = '';
      if (newProfileImage) {
        console.log('Attempting to upload image to Firebase Storage...');
        const storage = getStorage(); // Get the storage instance
        const imageRef = storageRef(storage, `profileImages/${userID}`); // Use storageRef with the storage instance
        const response = await fetch(newProfileImage);
        const blob = await response.blob();

        // Use uploadBytes to upload the blob data
        const uploadTask = uploadBytes(imageRef, blob);
        const snapshot = await uploadTask;

        imageUrl = await getDownloadURL(snapshot.ref);
          //console.log('Image Reference:', snapshot.ref); 
      }
  
      // Update the user document in Firestore with the new profile data
      const usersCollection = collection(database, 'users');
      const userQuery = query(usersCollection, where('userID', '==', userID));
      const userQuerySnapshot = await getDocs(userQuery);
  
      if (!userQuerySnapshot.empty) {
        const userDocRef = userQuerySnapshot.docs[0].ref;
          //console.log('User Document Reference:', userDocRef);
        await updateDoc(userDocRef, {
          username: newUsername,
          userBio: newBio,
          userProfile: newProfileName,
          userProfileImg: newProfileImage ? imageUrl : userProfileImg,
        });
  
        // Update the state with the new values
        route.params.setUsername(newUsername);
        route.params.setProfileName(newProfileName);
        route.params.setBio(newBio);

        // Call the updateProfileImg function from UserIcon
        updateProfileImg(newProfileImage ? imageUrl : userProfileImg);
        
        // Show a success message
        Alert.alert('Success', 'Profile updated successfully.');
  
        // Set loading back to false
        setLoading(false);
  
        // Navigate back to the Profile screen
        navigation.navigate('Profile');
      } else {
        console.log('User document not found.');
        Alert.alert('Error', 'User document not found. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      Alert.alert('Error', 'Failed to update user profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Go back to the previous screen (listings page)
    navigation.goBack();
  }; 

  

  return (
    //Parent box
    <Box w="100%" h="100%" justifyContent="center" alignItems="center">
      <Box p="$6" w="100%"maxWidth="$96">
        {/* Heading */}
        <VStack space="xs" pb="$3">
            <Pressable onPress={back}>
              <MaterialCommunityIcons name="arrow-left-circle-outline" color={colors.secondary} size={25} />
            </Pressable>
            <Heading lineHeight={60} fontSize="$3xl" color={colors.secondary}>Edit Profile</Heading>
        </VStack>

        {/* Choose Image */}
        <VStack space="xl" m={1} alignItems="center">
          <TouchableOpacity onPress={handleChooseImage}>
            {newProfileImage && <Image source={{ uri: newProfileImage }} style={styles.image}
            />}
            <Text style={styles.text}>Upload New Image</Text>
          
          </TouchableOpacity>
        </VStack>

        {/* New Profile Name Input */}
        <VStack space='xl' py="$3">
          <FormControl size="md">
            <FormControlLabel mb="$2">
                  <FormControlLabelText>New Profile Name</FormControlLabelText>
            </FormControlLabel>
            <Input w="100%">
              <InputField 
                placeholder="Enter new profile name"
                onChangeText={(text) => setNewProfileName(text)}
                value={newProfileName}
              />
            </Input>
          </FormControl>
        </VStack>

        {/* New Username Input */}
        <VStack space='xl' py="$3">
          <FormControl size="md">
            <FormControlLabel mb="$2">
                <FormControlLabelText>New Username</FormControlLabelText>
            </FormControlLabel>
            <Input w="100%">
              <InputField 
                  type="username"
                  placeholder="Enter new username"
                  onChangeText={(text) => setNewUsername(text)}
                  value={newUsername}
                />
            </Input>
          </FormControl>
        </VStack>

       {/* New Bio Input */}
       <VStack space='xl' py="$3">
          <FormControl size="md">
            <FormControlLabel mb="$2">
                <FormControlLabelText>New Bio</FormControlLabelText>
            </FormControlLabel>
            <Input w="100%">
              <InputField 
                  placeholder="Enter new bio"
                  onChangeText={(text) => setNewBio(text)}
                  value={newBio}
              />
            </Input>
          </FormControl>
        </VStack>

      {/* Save Button */}
      <VStack space="lg" pt="$4">
                <Button size="sm" backgroundColor={colors.primary} onPress={handleSaveProfile} disabled={loading}>
                    <ButtonText>{loading ? 'Saving...' : 'Save'}</ButtonText>
                </Button>
      </VStack>

      {/* Cancel Button */}
      <VStack space="lg" pt="$4">
                <Button size="sm" backgroundColor={colors.gray} onPress={handleCancel} disabled={loading}>
                    <ButtonText>Cancel</ButtonText>
                </Button>
      </VStack>

      {/* Delete Account Button */}
      <VStack space="lg" pt="$4">
                <Button size="sm" backgroundColor={colors.gray} onPress={handleCancel} disabled={loading}>
                    <ButtonText>Delete Account</ButtonText>
                </Button>
      </VStack>
      
      </Box>
    </Box>
 
  );
}

const styles = StyleSheet.create({
  text: {
      color: colors.white,
      fontSize: 15,
      alignItems: "center",
      backgroundColor: colors.primary,
      padding: 10,
      marginTop: 5,
      marginHorizontal: 70,
      borderRadius: 50,
  },
  image: {
      height: 170,
      width:170,
      borderRadius: 85,
      borderWidth: 2,
      borderColor: colors.primary,
      marginLeft: 50,
      marginBottom: 10
  }
});
