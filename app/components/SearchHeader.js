import * as React from 'react';
import {
    Box,
    VStack,
    HStack,
    Input,
    InputField,
    FormControl,
    Button,
    ButtonText
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function SearchHeader() {
    return (
        <Box w="100%" h="18%" bg={colors.primary} mb={0} pb={10}>
            <VStack>
                <HStack p="$5" w="100%" mt={50}>
                    <FormControl
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <Input w={250}  backgroundColor='white'>
                                <InputField type="username" defaultValue="" placeholder="Search" />
                            </Input>
                        </FormControl>

                        <Button variant="solid" ml={10} size="sm" backgroundColor="green" w="25%">
                            <ButtonText sx={{
                                color: "$white"
                            }}>Search</ButtonText>
                        </Button>
                </HStack>

                <HStack space = "xs" flexWrap='wrap' ml={10} mt={-10}>
                    <Button variant="solid" ml={10} size="xs" backgroundColor="green" w="15%" borderRadius={100}>
                        <ButtonText sx={{
                            color: "$white"
                        }}>Tags</ButtonText>
                    </Button>    
                </HStack>
            </VStack>
        </Box>
    )
}