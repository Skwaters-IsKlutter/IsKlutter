import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateDoc, doc, collection, where, getDocs, query } from 'firebase/firestore';
import { storage, database } from '../../config/firebase';  // Import only storage
import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';  // Import necessary storage functions

export default function EditProfileScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const { userProfileImg, username, profileName, bio, userID, setProfileName, setUsername, setBio } = route.params;
  const [newProfileName, setNewProfileName] = useState(profileName);
  const [newUsername, setNewUsername] = useState(username);
  const [newBio, setNewBio] = useState(bio);
  const [newProfileImage, setNewProfileImage] = useState(null);

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permission to upload images.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync();
  
    if (!result.canceled) {
      setNewProfileImage(result.uri); // Use result.uri to get the image URI
    }
  };

  const handleSaveProfile = async () => {
    // Check if the new username is provided
    if (!newUsername) {
      Alert.alert('Error', 'New username is required.');
      return;
    }
  
    if (username !== newUsername) {
      // Check if the new username is already taken
      const usersCollection = collection(database, 'users');
      const usernameQuery = query(usersCollection, where('username', '==', newUsername));
      const usernameQuerySnapshot = await getDocs(usernameQuery);
  
      if (!usernameQuerySnapshot.empty) {
        Alert.alert('Error', 'Username already exists. Please choose a different username.');
        return;
      }
    }
  
    try {
      // Set loading to true
      setLoading(true);
  
      let imageUrl = '';
      if (newProfileImage) {
        console.log('Attempting to upload image to Firebase Storage...');
        const imageRef = storage.ref(`profileImages/${userID}`);
        console.log('Image Reference:', imageRef);
        const response = await fetch(newProfileImage);
        const blob = await response.blob();
  
        // Use uploadBytes to upload the blob data
        const uploadTask = uploadBytes(imageRef, blob);
        const snapshot = await uploadTask;
  
        imageUrl = await snapshot.ref.getDownloadURL();
        console.log('Image Reference:', snapshot.ref); // Move this inside the if block
      }
  
      // Update the user document in Firestore with the new profile data
      const usersCollection = collection(database, 'users');
      const userQuery = query(usersCollection, where('userID', '==', userID));
      const userQuerySnapshot = await getDocs(userQuery);
  
      if (!userQuerySnapshot.empty) {
        const userDocRef = userQuerySnapshot.docs[0].ref;
        console.log('User Document Reference:', userDocRef);
        await updateDoc(userDocRef, {
          username: newUsername,
          userBio: newBio,
          userProfile: newProfileName,
          userProfileImg: imageUrl || '',
        });
  
        // Update the state with the new values
        route.params.setUsername(newUsername);
        route.params.setProfileName(newProfileName);
        route.params.setBio(newBio);
  
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
    <View>
      <Text>Edit Profile</Text>
      <View>
        <Button title="Choose Image" onPress={handleChooseImage} />
        {newProfileImage && <Image source={{ uri: newProfileImage }} style={{ width: 200, height: 200 }} />}
      </View>
      <View>
        <Text>New Profile Name:</Text>
        <TextInput
          placeholder="Enter new profile name"
          onChangeText={(text) => setNewProfileName(text)}
          value={newProfileName}
        />
      </View>
      <View>
        <Text>New Username:</Text>
        <TextInput
          placeholder="Enter new username"
          onChangeText={(text) => setNewUsername(text)}
          value={newUsername}
        />
      </View>
      <View>
        <Text>New Bio:</Text>
        <TextInput
          placeholder="Enter new bio"
          onChangeText={(text) => setNewBio(text)}
          value={newBio}
        />
      </View>
      <Button title="Save" onPress={handleSaveProfile} />
      <Button title="Cancel" onPress={handleCancel}/>
    </View>
  );
}
