// Avatar.js

import React, {useEffect} from 'react';
import { Avatar, AvatarFallbackText, AvatarImage } from '@gluestack-ui/themed';
import colors from '../config/colors';
import { Image, Text, View } from 'react-native';

const UserAvatar = ({ username, userIcon, userProfileImg }) => {
  console.log('userProfileImg', userProfileImg);

  useEffect(() => {
    // Directly update the image source when userProfileImg changes
    // This assumes that you are using a state to manage the image source
    // For example, you might use useState to manage the image source state

    // setImageSource(userProfileImg); // Uncomment and replace with your state management logic
  }, [userProfileImg]);
  return (
    <View>
      {userProfileImg ? (
        <Image
          source={{ uri: userProfileImg }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      ) : (
        <Text>{username ? username.charAt(0).toUpperCase() : 'Username'}</Text>
      )}
    </View>
  );
};

export default UserAvatar;

