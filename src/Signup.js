import * as React from 'react';
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
import { useNavigation } from '@react-navigation/native';

import colors from '../app/config/colors.js';
import Routes from '../app/components/Routes.js';

export default function SignupScreen() {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%" justifyContent="center" alignItems="center">
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            {/* Form control for login */}
            <Box
                p="$6"
                w="100%"
                maxWidth="$96"
            >
                {/* Heading */}
                <VStack space="xs" pb="$12">
                    <Heading lineHeight={60} fontSize="$5xl">New here?</Heading>
                    <Heading lineHeight={30} fontSize="$2xl">Sign up to start decluttering.</Heading>
                </VStack>

                {/* Email input */}
                <VStack space="xl" py="$3">
                    <FormControl
                        size="md"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField type="email" defaultValue="" placeholder="Enter username" />
                        </Input>
                    </FormControl>
                </VStack>

                {/* Username input */}
                <VStack space="xl" py="$3">
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

                {/* Password input */}
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
                            <InputField type="newPassword" defaultValue="" placeholder="Enter password" />
                        </Input>
                    </FormControl>
                </VStack>
                
                {/* Re-enter password input */}
                <VStack space="xl" py="$2">
                    <FormControl
                        size="md"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Re-enter Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField type="retypePassword" defaultValue="" placeholder="Enter password" />
                        </Input>
                    </FormControl>
                </VStack>

                {/* Submit button */}
                <VStack space="lg" pt="$4">
                    <Button size="sm" backgroundColor={colors.primary} onclick="">
                        <ButtonText>Sign Up</ButtonText>
                    </Button>
                </VStack>
            </Box>

            {/* Go to sign up */}
            <Box flexDirection="row" top={800} position="absolute">
                <Button variant="solid" m="$7" size="sm" backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.LOGIN)}
                >
                    <ButtonText sx={{
                        color: colors.medium
                    }}>Already have an account? Sign in</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}