import React, {useEffect} from 'react';
import { Avatar, AvatarFallbackText, AvatarImage } from '@gluestack-ui/themed';
import colors from '../config/colors';
import { Image, Text, View } from 'react-native';
import iconPlaceHolder from '../../assets/img/profile-holder.jpg';

const UserAvatar = ({ username, userIcon, userProfileImg }) => {
  //console.log('userProfileImg', userProfileImg);

  useEffect(() => {
    // Directly update the image source when userProfileImg changes
  }, [userProfileImg]);

  return (
    <View>
      {userProfileImg ? (
        <Image
          source={{ uri: userProfileImg }}
          style={{ width: 40, height: 40, borderRadius: 25 }}
        />
      ) : (
        <Image
          source={iconPlaceHolder}
          style={{ width: 40, height: 40, borderRadius: 25 }}
        />
      )}
    </View>
  );
};

export default UserAvatar;

