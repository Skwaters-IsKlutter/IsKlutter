import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import { VStack, HStack, Heading, Box, Button, ButtonText, Avatar, AvatarFallbackText, AvatarImage, Text, Image } from '@gluestack-ui/themed';


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
    <Box bgColor="white" p={20} borderRadius={5}>
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

      <VStack space="xs" pb="$2" py="$3">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading pt="$1.5" pl="$1" fontSize={30} color={colors.primary}>
            {profileName}
          </Heading>
          <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={20} onPress={handleChatPress}>
            <ButtonText color={colors.white} fontSize="$sm">
              Chat
            </ButtonText>
          </Button>
        </HStack>

        <HStack justifyContent="space-between" alignItems="center">
          <Heading px="$10" pl="$1" fontSize={20} color={colors.black} pt="0" pb="0">
            {`@${username}`}
          </Heading>
        </HStack>

        <Text px="$10" pl="$1" fontSize={15} color={colors.gray} pt="0" pb="0">
          {bio}
        </Text>
      </VStack>
    </Box>
  );
}