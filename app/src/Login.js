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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function LoginPage() {
    const navigation = useNavigation();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        try {
            if (email && password) {
                await signInWithEmailAndPassword(auth, email, password);
                navigation.navigate(Routes.HOMEPAGE);
                console.log("Sign in successful.")
            } else {
                Alert.alert("Login Failed", "Please check your email and password.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // const onHandleLogin = () => {
    //     if (email && password) {
    //         signInWithEmailAndPassword(auth, email, password)
    //             .then(() => console.log("Login success"))
    //             .catch((err) => console.error("Login error", err.message));
    //     }
    // };

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
                    <Heading lineHeight={60} fontSize="$5xl">Welcome back</Heading>
                    <Heading lineHeight={30} fontSize="$2xl">Sign in to IsKlutter now.</Heading>
                </VStack>

                {/* Email input */}
                <VStack space="xl" py="$3">
                    <FormControl size="md">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </Input>
                    </FormControl>
                </VStack>

                {/* Password input */}
                <VStack space="xl" py="$2">
                    <FormControl size="md">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%">
                            <InputField
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </Input>
                    </FormControl>
                </VStack>

                {/* Submit button */}
                <VStack space="lg" pt="$4">
                    <Button size="sm" backgroundColor={colors.primary} onPress={handleLogin}>
                        <ButtonText>Sign In</ButtonText>
                    </Button>
                </VStack>
            </Box>

            {/* Go to sign up */}
            <Box flexDirection="row" top={800} position="absolute">
                <Button variant="solid" m="$7" size="sm" backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.SIGNUP)}>
                    <ButtonText sx={{
                        color: colors.medium
                    }}>Don't have an account yet? Sign up</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}