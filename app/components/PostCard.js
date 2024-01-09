import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  ButtonText,
  Heading,
  Text,
  Image,
  Pressable
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';

import colors from '../config/colors.js';
import CommunityCommentBox from './CommunityCommentBox.js';

export default function PostCard({ username, userProfileImg, description, toIndividualPost }) {
    console.log(userProfileImg); 
  return (
    <Pressable onPress={toIndividualPost}>
      <VStack>
        <Box
          backgroundColor={colors.white}
          borderRadius={5}
          width={370}
          ml={10}
          mt={10}
        >
          <HStack space="sm" alignItems="center" p={5} m={5}>
          <Image
            source={userProfileImg ? { uri: userProfileImg } : require('../../assets/img/profile-holder.jpg')}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            alt="User Avatar"
            />
            <Text color={colors.secondary} size="md" bold={true}>
              {username}
            </Text>
          </HStack>

          <Text color="black" pb="$3" size="sm" ml="$3" mt={2}>
            {description}
          </Text>

          {/* Additional components */}
        </Box>
      </VStack>
    </Pressable>
  );
}
