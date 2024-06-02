import React, { useState, useEffect }  from 'react';
import {
    Box,
    Pressable,
    HStack,
    Text
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import PostBox from '../components/PostBox';

export default function AddPostPage() {
    const navigation = useNavigation();

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <Box w="100%" h="100 %">
           {/* Header */}
            <Box backgroundColor={colors.primary}>
                <HStack p="$2" w="100%" mt={25} alignItems='center' >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Text fontSize={24} color={colors.white} lineHeight={50} fontFamily={fonts.semibold} m={10}>Create Post</Text>
                </HStack>
            </Box>

      
            <Box w="100%" p="$2" flex={1}>
                 <PostBox />
            </Box>
        </Box>
    );
}