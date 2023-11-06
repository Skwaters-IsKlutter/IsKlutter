import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Image,
    Button,
    ButtonText,
    Input,
    InputField,
} from '@gluestack-ui/themed';


import colors from '../config/colors.js';


export default function PostBox({post, posterUser, posterIcon}) {
    return(
        <Box p="$2" m="0">
            <HStack space="xs" pb="$5">
                <Image source={posterIcon} h={45} w={45} alt="icon" borderRadius={100}/> 
                <Input bg={colors.white} borderColor={colors.secondary} h={50} w="75%">
                        <InputField multiline={true} size="md" placeholder="Whatchuthink..." />
                </Input>
                <Button variant="solid" size="sm" bg={colors.secondary} borderRadius={12} onPress={post}>
                    <ButtonText color={colors.white} fontSize="$sm">Post</ButtonText>
                </Button>
            </HStack>
        </Box>
    )
}










