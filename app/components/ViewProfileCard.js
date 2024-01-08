import * as React from 'react';
import { VStack, HStack, Heading, Box, Button, ButtonText, Avatar, AvatarFallbackText, AvatarImage, Text, Image } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import colors from '../config/colors.js';
import profileImgPlaceHolder from '../../assets/img/profile-holder.jpg';
import { auth } from '../../config/firebase';

export default function ProfileCard({ userProfileImg, username, profileName, bio, userID, setProfileName, setUsername, setBio, loading }) {
  const navigation = useNavigation();
  const handleEditProfile = () => {
    // Navigate to the EditProfile screen and pass necessary data
    navigation.navigate('EditProfile', {
      userProfileImg,
      username,
      profileName,
      bio,
      userID,
      setProfileName,
      setUsername,
      setBio,
      loading
    });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout error if needed
    }
  };

  return (
    <Box bgColor="white" p={20} borderRadius={5}>
      {/* Avatar*/}
      <Avatar borderRadius="$full" alignSelf="center" size="2xl">
        {userProfileImg && (
          <AvatarImage source={{ uri: userProfileImg }} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
        )}
        {!userProfileImg && <AvatarFallbackText>{/* Empty Fallback Text */}</AvatarFallbackText>}
        {!userProfileImg && (
          <AvatarImage source={profileImgPlaceHolder} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
        )}
      </Avatar>

      <VStack space="xs" pb="$2" py="$3">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading pt="$1.5" pl="$1" fontSize={30} color={colors.primary}>
            {profileName}
          </Heading>
          <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={20} onPress={handleEditProfile}>
            <ButtonText color={colors.white} fontSize="$sm">
              Chat
            </ButtonText>
          </Button>
        </HStack>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <HStack justifyContent="space-between" alignItems="center">
            <Heading px="$10" pl="$1" fontSize={20} color={colors.black} pt="0" pb="0">
              {`@${username}`}
            </Heading>
            <Button variant="solid" size="sm" backgroundColor={colors.gray} borderRadius={20} onPress={handleLogout}>
              <ButtonText color={colors.white} fontSize="$sm">
                Logout
              </ButtonText>
            </Button>
            </HStack>
            

            <Text px="$10" pl="$1" fontSize={15} color={colors.gray} pt="0" pb="0">
              {bio}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
