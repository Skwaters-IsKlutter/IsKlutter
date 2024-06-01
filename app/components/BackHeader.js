
import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Header,
    Input,
    InputField,
    InputSlot,
    InputIcon,
    Avatar,
    AvatarFallbackText,
    AvatarImage,
    Pressable,
} from '@gluestack-ui/themed';
import { useNavigation,  useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import UserAvatar from './Avatar.js';
import { useUser } from '../components/UserIcon.js';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import fonts from '../config/fonts.js';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function BackHeader({username, userIcon, userProfile, back }) {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })
    



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
        console.log('Forcing re-render in SearchHeaderBack');
      }, [userProfileImg]); // Log when userProfileImg changes

    return (
        <Box w="100%" maxHeight={150} bg={colors.primary}>
            <VStack>
                <HStack p="$2" w="100%" mt={50} alignItems="center">
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Box >
                        <Text fontSize={24} color={colors.white} ml={85} lineHeight={40} fontFamily="Poppins_600SemiBold" >Product Details</Text>
                    </Box>
                </HStack>
            </VStack>
        </Box>

    )
}