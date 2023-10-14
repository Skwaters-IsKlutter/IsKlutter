import React from 'react';
import {
    VStack,
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
    InputField
} from '@gluestack-ui/themed';

import colors from '../app/config/colors.js'

export default function LoginPage() {
    return (
        // 
        <Box w="100%" h="100%" justifyContent="center" alignItems="center">
            {/* Logo */}
            <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack>
            {/* Form control for login */}
            <Box
                p="$5"
                w="100%"
                maxWidth="$96"
            >
                {/* <VStack space="xs" pb="$4" backgroundColor={colors.light}>
                    <Image source={require('../assets/img/icon.png')} w="$600" alt="logo" />
                </VStack> */}
                <VStack space="xs" pb="$4">
                    <Heading lineHeight={60} fontSize="$2xl">Welcome back</Heading>
                </VStack>
                <VStack space="xl" py="$2">
                    <FormControl
                        size="md"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Username</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField type="username" defaultValue="" placeholder="Enter username" />
                        </Input>
                    </FormControl>
                </VStack>
                <VStack space="xl" py="$2">
                    <FormControl
                        size="md"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField type="username" defaultValue="" placeholder="Enter password" />
                        </Input>
                    </FormControl>
                </VStack>
                <VStack space="lg" pt="$4">
<<<<<<< HEAD
                    <Button variant="outline" size="sm" bg={colors.primary} borderColor={colors.primary}>
                        <ButtonText sx={{
                            color: colors.medium
                        }}>Sign In</ButtonText>
                    </Button>
                </VStack>
            </Box>
            <Box alignItems="center">
                <VStack space="xs" pt="$4">
                    <Button variant="link" p="$0" size="sm">
                        <ButtonText sx={{
                            color: colors.medium,
                            backgroundColor: colors.secondary,
                            fontWeight: "$bold"
                        }}>Already have an account? Log in</ButtonText>
                    </Button>
=======
                    <Button size="sm" backgroundColor={colors.primary}>
                        <ButtonText>Log In</ButtonText>
                    </Button>
                    <Box flexDirection="row">
                        <Button variant="link" p="$0" size="sm">
                            <ButtonText sx={{
                                color: colors.primary,
                            }}>Already have an account? Log in</ButtonText>
                        </Button>
                    </Box>
>>>>>>> parent of c7dc9a2 (Reconfigured Firebase SDKs and config files)
                </VStack>
            </Box>
        </Box>
    )
}