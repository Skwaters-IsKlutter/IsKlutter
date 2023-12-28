import * as React from 'react';
import {
  VStack,
  HStack,
  Heading,
  Box,
  Button,
  ButtonText,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Text,
  Input,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Modal, View, TextInput, Button as RNButton, Text as RNText, Alert } from 'react-native';
import { updateDoc, doc, collection, where, getDocs, query } from 'firebase/firestore';
import {database} from '../../config/firebase';


import colors from '../config/colors.js';

export default function ProfileCard({username, userIcon, bio, profileName, user, setProfileName, setUsername, setBio}) {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [newProfileName, setNewProfileName] = React.useState(profileName);
    const [newUsername, setNewUsername] = React.useState(username);
    const [newBio, setNewBio] = React.useState(bio);
  
    React.useEffect(() => {
      // Update local state when the profile data changes
      setNewProfileName(profileName);
      setNewUsername(username);
      setNewBio(bio);
    }, [profileName, username, bio]);
  
    const handleEditProfile = () => {
      setModalVisible(true);
    };
  
    const handleSaveProfile = async () => {
      // Check if the user object is valid
      if (!user || !user.userID) {
        console.error('Invalid user object:', user);
        Alert.alert("Error", "Invalid user object. Please try again.");
        return;
      }
  
      // Check if the username is empty
      if (newUsername.trim() === "") {
        Alert.alert("Error", "Username is required");
        return;
      }
  
      // Get the reference to the user document in Firestore
      const usersCollection = collection(database, 'users');
      const queryCondition = where('userID', '==', user.userID);
      const querySnapshot = await getDocs(query(usersCollection, queryCondition));
  
      if (querySnapshot.empty) {
        console.error('User document not found');
        Alert.alert("Error", "User document not found. Please try again.");
        return;
      }
  
      // Assuming there's only one document with the given userID
      const userDocRef = querySnapshot.docs[0].ref;
  
      try {
        // Update the user document in Firestore with the new profile data
        await updateDoc(userDocRef, {
          username: newUsername,
          userBio: newBio,
          userProfile: newProfileName,
        });
  
        // Update the parent component state
        setProfileName(newProfileName);
        setUsername(newUsername);
        setBio(newBio);

        // Reload the page to reflect changes
        navigation.navigate('Profile');

        // Close the modal
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating user profile:', error);
        Alert.alert("Error", "Failed to update user profile. Please try again.");
      }
    };
  
    const handleCancelEdit = () => {
      // Close the modal and reset the input fields
      setModalVisible(false);
      setNewProfileName(profileName);
      setNewUsername(username);
      setNewBio(bio);
    };

  return (
    <Box bgColor="white" p={20} borderRadius={5}>
      {/* Avatar*/}
      <Avatar borderRadius="$full" alignSelf="center" size="2xl">
        <AvatarFallbackText>{username}</AvatarFallbackText>
        <AvatarImage>{userIcon}</AvatarImage>
      </Avatar>

      <VStack space="xs" pb="$2" py="$3">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading pr="$12" pt="$1.5" pl="$1" fontSize={30} color={colors.primary}>
            {profileName}
          </Heading>
          <Button
            variant="solid"
            size="sm"
            backgroundColor={colors.primary}
            borderRadius={20}
            onPress={() => handleEditProfile()}
            >
            <ButtonText color={colors.white} fontSize="$sm">
                Edit Profile
            </ButtonText>
            </Button>
        </HStack>

        <Heading px="$10" pl="$1" fontSize={20} color={colors.black} pt="0" pb="0">
          {`@${username}`}
        </Heading>

        <Text px="$10" pl="$1" fontSize={15} color={colors.gray} pt="0" pb="0">
          {bio}
        </Text>
      </VStack>

      <Modal visible={isModalVisible} animationType="slide">
      <View>
          <RNText>Edit Profile</RNText>
          <View>
            <RNText>New Profile Name:</RNText>
            <TextInput
              placeholder="Enter new profile name"
              onChangeText={(text) => setNewProfileName(text)}
              value={newProfileName}
            />
          </View>
          <View>
            <RNText>New Username:</RNText>
            <TextInput
              placeholder="Enter new username"
              onChangeText={(text) => setNewUsername(text)}
              value={newUsername}
            />
          </View>
          <View>
            <RNText>New Bio:</RNText>
            <TextInput
              placeholder="Enter new bio"
              onChangeText={(text) => setNewBio(text)}
              value={newBio}
            />
          </View>
          <RNButton title="Save" onPress={handleSaveProfile} />
          <RNButton title="Cancel" onPress={handleCancelEdit} />
        </View>
      </Modal>
    </Box>
  );
}

