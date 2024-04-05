import React from 'react';
import {
    HStack, 
    VStack, 
    Heading, 
    Box, 
    Input, 
    InputField, 
    InputSlot, 
    InputIcon, 
    Pressable
} from '@gluestack-ui/themed';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';

import { useNavigation } from '@react-navigation/native';

export default function UpperTabBar({ pageTitle }) {
    const navigation = useNavigation();

    return (
        <Box backgroundColor={colors.primary}>
            <HStack p="$2" w="100%" mt={45} alignItems="center">
                <Pressable onPress={navigation.goBack}>
                    <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                </Pressable>
                <Heading lineHeight={50} fontSize={30} color={colors.white} ml={10} flex={1}>
                    {pageTitle}
                </Heading>
                <Pressable onPress={() => navigation.navigate(Routes.PROFILE)} mr={15}>
                    <UserAvatar />
                </Pressable>
            </HStack>

            <VStack>
                <HStack p="$3" w="100%" justifyContent="space-evenly">
                    <Input w="90%" bg={colors.white} size="sm" borderRadius={20} left={-5} h={40}>
                        <InputField
                            placeholder="Search"
                        />
                        <InputSlot>
                            <InputIcon>
                                <MaterialCommunityIcons name="magnify" color={colors.primary} size={15} right={15} />
                            </InputIcon>
                        </InputSlot>
                    </Input>
                </HStack>
            </VStack>
        </Box>
    );
}
