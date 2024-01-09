import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
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

export default function SearchHeaderBack({ search, username, userIcon, userProfile, back }) {
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
                <HStack p="$2" w="100%" mt={50} justifyContent="space-evenly" alignItems="center">
                    <Pressable onPress={back}>
                        <MaterialCommunityIcons name="arrow-left-circle-outline" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Input w="60%" bg={colors.white} borderColor={colors.primary} size="sm">
                        <InputField placeholder="Search" />
                        <InputSlot>
                            <InputIcon>
                                <MaterialCommunityIcons name="magnify" color={colors.primary} size={15} m={5} />
                            </InputIcon>
                        </InputSlot>
                    </Input>

                    {/* <Button variant="solid" ml={5} size="sm" backgroundColor={colors.secondary} w="25%">
                        <ButtonText sx={{color: colors.white}}>Search</ButtonText>
                    </Button> */}

                    <Pressable onPress={() => navigation.navigate(Routes.MESSAGES)} pl={10}>
                        <MaterialCommunityIcons name="message" color={colors.medium} size={25}  />
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate(Routes.PROFILE)}>
                        <UserAvatar username={username} userIcon={userIcon} userProfileImg={userProfileImg} size={25}/>
                    </Pressable>
                </HStack>

                {/* TODO: tags */}
                {/* <HStack space = "xs" flexWrap='wrap' ml={10} mt={-10}>
                    <Button variant="solid" ml={10} size="xs" backgroundColor="green" w="15%" borderRadius={100}>
                        <ButtonText sx={{
                            color: "$white"
                        }}>Tags</ButtonText>
                    </Button>    
                </HStack> */}

            </VStack>
        </Box>
    )
}