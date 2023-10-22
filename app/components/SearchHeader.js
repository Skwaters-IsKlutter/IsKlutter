import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Input,
    InputField,
    Button,
    ButtonText,
    Center
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function SearchHeader() {
    return (
        <Box w="100%" h="18%" mb={0} pb={10}>
            <VStack>
                <Center>

                <HStack p="$5" w="100%" mt={50} justifyContent="center" alignItems="center">
                    <Input w="75%" bg={colors.white} borderColor={colors.secondary} size="sm">
                        <InputField />
                    </Input>

                    <Button variant="solid" ml={5} size="sm" backgroundColor={colors.secondary} w="25%">
                        <ButtonText sx={{color: "$white"}}>Search</ButtonText>
                    </Button>
                </HStack>
                </Center>

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