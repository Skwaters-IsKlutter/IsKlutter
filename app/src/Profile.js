import * as React from 'react';
import {
    VStack,
    HStack,
    Heading,
    Image,
    Box,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlErrorIcon,
    Input,
    InputField,
    Icon,
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function ProfilePage( { key : userID, username, userIcon } ) {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%">
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            <SearchHeader userIcon={ require("../../assets/img/usericon.jpg")} />

            <Box>

                <VStack space="xs" pb="$12">
                    <Heading lineHeight={30} fontSize="$2xl">Profile</Heading>
                </VStack>
            </Box>
        </Box>
    )
}