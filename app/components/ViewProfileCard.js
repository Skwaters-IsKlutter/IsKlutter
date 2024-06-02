import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import { VStack, HStack, Heading, Box, Button, ButtonText, Avatar, AvatarFallbackText, AvatarImage, Text, Image } from '@gluestack-ui/themed';

import fonts from '../config/fonts.js';
import colors from '../config/colors.js';
import profileImgPlaceHolder from '../../assets/img/profile-holder.jpg';
import { auth } from '../../config/firebase';

export default function ViewProfileCard({ userProfileImg, username, profileName, bio, userID }) {
  const navigation = useNavigation();

  const handleChatPress = () => {
    navigation.navigate('PrivateMessage', { recipient: username }); // Use username instead of sellerName
    Alert.alert('Chat Button Pressed', `Navigate to chat screen with ${username}`);
  };

  return (
    <Box  p={15} borderRadius={5}>
      {/* Avatar */}
      <Avatar borderRadius="$full" alignSelf="center" size="2xl">
        {userProfileImg && (
          <AvatarImage source={{ uri: userProfileImg }} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
        )}
        {!userProfileImg && <AvatarFallbackText>{/* Empty Fallback Text */}</AvatarFallbackText>}
        {!userProfileImg && (
          <AvatarImage source={profileImgPlaceHolder} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
        )}
      </Avatar>

      <VStack space="xs" pb="$2" py="$3" alignItems="center">
        <HStack justifyContent="space-between" alignItems="center">
          <Text pt="$4" fontSize={20} color={colors.white} fontFamily={fonts.semibold}>
            {profileName}
          </Text>
          {/* <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={20} onPress={handleChatPress}>
            <ButtonText color={colors.white} fontSize="$sm">
              Chat
            </ButtonText>
          </Button> */}
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Text px="$5"fontSize={13} color={colors.white} pt="$1" pb="0" fontFamily={fonts.semibold}>
            {`@${username}`}
          </Text>
        </HStack>

        <Text px="$10" fontSize={15} color={colors.white} pt="0" pb="0" fontFamily={fonts.regular}>
          {bio}
        </Text>
      </VStack>
    </Box>
  );
}