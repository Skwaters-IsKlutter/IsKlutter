import * as React from 'react';
import { VStack, HStack, Heading, Box, Button, ButtonText, Avatar, AvatarFallbackText, AvatarImage, Text } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import colors from '../config/colors.js';

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

  return (
    <Box bgColor="white" p={20} borderRadius={5}>
      {/* Avatar*/}
      <Avatar borderRadius="$full" alignSelf="center" size="2xl">
        <AvatarFallbackText>{username}</AvatarFallbackText>
        {/* <AvatarImage>{userIcon}</AvatarImage> */}
      </Avatar>

      <VStack space="xs" pb="$2" py="$3">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading pr="$12" pt="$1.5" pl="$1" fontSize={30} color={colors.primary}>
            {profileName}
          </Heading>
          <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={20} onPress={handleEditProfile}>
            <ButtonText color={colors.white} fontSize="$sm">
              Edit Profile
            </ButtonText>
          </Button>
        </HStack>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Heading px="$10" pl="$1" fontSize={20} color={colors.black} pt="0" pb="0">
              {`@${username}`}
            </Heading>

            <Text px="$10" pl="$1" fontSize={15} color={colors.gray} pt="0" pb="0">
              {bio}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
