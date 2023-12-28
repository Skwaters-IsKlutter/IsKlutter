import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { updateDoc, doc, collection, where, getDocs, query } from 'firebase/firestore';
import { database } from '../../config/firebase';

export default function EditProfileScreen({ route, navigation }) {
    const [loading, setLoading] = React.useState(false);
    const {userIcon, username, profileName, bio, userID, setProfileName, setUsername, setBio,} = route.params;
    const [newProfileName, setNewProfileName] = React.useState(profileName);
    const [newUsername, setNewUsername] = React.useState(username);
    const [newBio, setNewBio] = React.useState(bio);

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
      
          // Update the user document in Firestore with the new profile data
          const usersCollection = collection(database, 'users');
          const userQuery = query(usersCollection, where('userID', '==', userID));
          const userQuerySnapshot = await getDocs(userQuery);
      
          if (!userQuerySnapshot.empty) {
            const userDocRef = userQuerySnapshot.docs[0].ref;
            await updateDoc(userDocRef, {
              username: newUsername,
              userBio: newBio,
              userProfile: newProfileName,
            });
      
            // Update the state with the new values
            route.params.setUsername(newUsername);
            setProfileName(newProfileName);
            setBio(newBio);
      
            // Show a success message
            Alert.alert('Success', 'Profile updated successfully.');
          } else {
            console.log('User document not found.');
            Alert.alert('Error', 'User document not found. Please try again.');
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
          Alert.alert('Error', 'Failed to update user profile. Please try again.');
        } finally {
          // Set loading back to false
          setLoading(false);
      
          // Navigate back to the Profile screen
          navigation.navigate('Profile');
        }
      };
      
      

  return (
    <View>
      <Text>Edit Profile</Text>
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
    </View>
  );
}
