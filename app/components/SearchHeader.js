import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function SearchHeader({ search, username, userIcon, userProfile }) {
    const navigation = useNavigation();

    return (
        <Box w="100%" maxHeight={150} bg={colors.primary}>
            <VStack>
                <HStack p="$3" w="100%" mt={50} justifyContent="center" alignItems="center">
                    <Input w="80%" bg={colors.white} borderColor={colors.primary} size="sm">
                        <InputField placeholder="Search" />
                            <InputSlot>
                                <InputIcon>
                                    <MaterialCommunityIcons name="magnify" color={colors.primary} />
                                </InputIcon>
                            </InputSlot>
                    </Input>

                    {/* <Button variant="solid" ml={5} size="sm" backgroundColor={colors.secondary} w="25%">
                        <ButtonText sx={{color: colors.white}}>Search</ButtonText>
                    </Button> */}

                    <Pressable onPress={() => navigation.navigate(Routes.PROFILE)}>
                        <Avatar bgColor='$amber600' size="md" borderRadius="$full" h={40} w={40} ml={10}>
                            <AvatarFallbackText>{username}</AvatarFallbackText>
                            <AvatarImage source={userIcon} />
                        </Avatar>
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