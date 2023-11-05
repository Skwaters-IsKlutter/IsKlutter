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
    Pressable,
    Text
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function ProfilePage({ key: userID, username, userIcon }) {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%">
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            <SearchHeader userIcon={require("../../assets/img/usericon.jpg")} />

            <Box>
                <VStack space="xs" pb="$12">
                    <Heading lineHeight={30} fontSize="$2xl">Profile</Heading>
                </VStack>
            </Box>

            {/*Profile*/}
            <Box bgColor="white" h="$100" pt='$5'>
                {/* <Avatar bgColor='$amber600' size="md" borderRadius="$full" alignSelf='center' size='2xl'>
                    <AvatarFallbackText>Kaira Saluria</AvatarFallbackText>
                </Avatar> */}

                <VStack space="xs" pb="$2" py='$3'>
                    <HStack>
                        <Heading pr='$12' pt='$1.5' pl='$1.5' fontSize={30} color={colors.secondary}>Sancebuche</Heading>
                        <Pressable h='100' w='20' borderCurve='$10'
                            onPress={() => console.log('Hello')} pl="3" pr="3" bg="$primary500" borderRadius='$3xl' sx={{ ':hover': { bg: "$primary400" } }}>
                            <Text color="white" p='$1.5'>Edit Profile</Text>
                        </Pressable>
                    </HStack>
                    <Heading px='$10' pl='$1.5' fontSize={15} color={colors.secondary}>@mimiyuuh</Heading>
                    <Heading px='$10' pl='$1.5' fontSize={15} color={colors.secondary}>User Description</Heading>
                    <Heading px='$10' pl='$1' fontSize={10} color={colors.secondary}>Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor</Heading>

                </VStack>

            </Box>
        </Box>
    )
}