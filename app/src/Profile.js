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

            <Box p="$6" w="100%" maxWidth="$96">
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Hello, {username}!</Heading>
                </VStack>


                {/*Profile*/}
                <Box bgColor="white" h="$100" p={20}>
                    <Avatar bgColor='$amber600' borderRadius="$full" alignSelf='center' size='2xl'>
                    <AvatarFallbackText>{username}</AvatarFallbackText>
                    <AvatarImage>{userIcon}</AvatarImage>
                </Avatar>

                    <VStack space="xs" pb="$2" py='$3'>
                        <HStack>
                            <Heading pr='$12' pt='$1.5' pl='$1.5' fontSize={30} color={colors.secondary}>{username}</Heading>
                            <Pressable borderRadius={8}
                                onPress={() => console.log('Hello')} bg={colors.secondary}>
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
        </Box>
    )
}