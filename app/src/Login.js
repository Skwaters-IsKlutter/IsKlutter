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
    const [error, setError] = React.useState(null); // State to manage error message

    const handleLogin = async () => {
        try {
            if (email && password) {
                await signInWithEmailAndPassword(auth, email, password);
                navigation.navigate(Routes.HOMEPAGE);
                console.log("Sign in successful.")
            } else {
                throw new Error("Please check your email and password.");
            }
        } catch (error) {
            setError(error.message); // Set the error message
            Alert.alert("Login Failed", error.message); // Optionally show an alert
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
        // justifyContent="center" alignItems="center"
        // Parent box
        <Box w="100%" h="100%" alignItems="center">
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            {/* Welcome back */}
            <Box
                p="$6"
                w="100%"
                height={400}
                backgroundColor={colors.primary}
                borderBottomEndRadius={100}
                borderBottomLeftRadius={100}
            >
                <VStack space="xs"mt={90} alignItems='center' >
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.white}>Welcome back!</Heading>
                    <Heading lineHeight={30} fontSize="$2xl" color={colors.white}>Log in to IsKlutter now.</Heading>
                </VStack>
            </Box>

            {/* Login Form */}
            <Box p="$6" w="100%" maxWidth="$96 " top={-180}>
                <Box backgroundColor={colors.white} p="$2" borderRadius={10}>
                {/* Email input */}
                <VStack space="xl">
                    <FormControl size="md" p="$2" pt="$5">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText color={colors.secondary}>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%" borderRadius={10}>
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
                <VStack space="xl " p="$2">
                    <FormControl size="md" py="$2">
                        <FormControlLabel mb="$2">
                            <FormControlLabelText color={colors.secondary}>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input w="100%" borderRadius={10}>
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
                <VStack space="lg" pt="$10" pb="$5" width="$80">
                    <Button size="sm" 
                            backgroundColor={colors.primary} 
                            onPress={handleLogin}
                            borderRadius={10}>
                        <ButtonText>Log In</ButtonText>
                    </Button>
                </VStack>
            </Box>
            </Box>
           

            {/* Go to sign up */}
            <Box flexDirection="row" top={700} position="absolute">
                <Button variant="solid" 
                        m="$7" 
                        size="sm" backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.SIGNUP)}>
                    <ButtonText sx={{
                        color: colors.white
                    }}>Don't have an account yet? Sign up</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}