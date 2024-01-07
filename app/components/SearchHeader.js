import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  Pressable,
} from '@gluestack-ui/themed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import UserAvatar from './Avatar.js';
import { useUser } from '../components/UserIcon.js';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function SearchHeader({ search, username, userIcon, onSearchChange }) {
    const navigation = useNavigation();
    const { userProfileImg } = useUser();
    const [, setForceUpdate] = useState(false);
  
    useFocusEffect(
      React.useCallback(() => {
            //console.log('Screen is focused. Updating userProfileImg:', userProfileImg);
        setForceUpdate(prev => !prev);
      }, [userProfileImg])
    );
  
    useEffect(() => {
      console.log('Forcing re-render in SearchHeader');
    }, [userProfileImg]); // Log when userProfileImg changes
  

    return (
        <Box w="100%" maxHeight={150} bg={colors.primary}>
          <VStack>
            <HStack p="$3" w="100%" mt={50} justifyContent="space-evenly" alignItems="center">
              <Input w="70%" bg={colors.white} borderColor={colors.primary} size="sm">
                <InputField
                  placeholder="Search"
                  value={search}
                  onChangeText={onSearchChange} // Add this line to handle text changes
                />
                <InputSlot>
                  <InputIcon>
                    <MaterialCommunityIcons name="magnify" color={colors.primary} />
                  </InputIcon>
                </InputSlot>
              </Input>
    
              <Pressable onPress={() => navigation.navigate(Routes.MESSAGES)} pl={10}>
                <MaterialCommunityIcons name="message" color={colors.white} size={25} />
              </Pressable>
    
              <Pressable onPress={() => navigation.navigate(Routes.PROFILE)}>
                <UserAvatar username={username} userIcon={userIcon} userProfileImg={userProfileImg} />
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      );
    }
