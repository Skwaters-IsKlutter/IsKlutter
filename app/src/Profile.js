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

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function ProfilePage( { key : userID, username, userIcon } ) {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box h="100%" justifyContent="center" alignItems="center">
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            <HStack>
                <Input w="75%" variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} mr={10}>

                    <InputField
                        placeholder='Enter Text here'
                    />
                </Input>

                <Avatar bgColor='$amber600' size="md" borderRadius="$full">
                    <AvatarFallbackText>{username}</AvatarFallbackText>
                </Avatar>
            </HStack>
            <Box>

                <VStack space="xs" pb="$12">
                    <Heading lineHeight={30} fontSize="$2xl">Profile</Heading>
                </VStack>
            </Box>
        </Box>
    )
}