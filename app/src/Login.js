import React, { useState } from 'react';
import { 
    VStack, 
    Heading, 
    Box, 
    Button, 
    ButtonText, 
    FormControl, 
    FormControlLabel, 
    FormControlLabelText, 
    Input, 
    InputField, 
    Text } from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

import fonts from '../config/fonts.js';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

export default function LoginPage() {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            if (email && password) {
                await signInWithEmailAndPassword(auth, email, password);
                navigation.navigate(Routes.HOMEPAGE);
                console.log("Sign in successful.");
                setEmail('');
                setPassword('');
            } else {
                setLoading(false);
                throw new Error(error.message);
            }
        } catch (error) {
            setError(error.message);
            Alert.alert("Login Failed", "Please check your email and password."); // Alert the user that the account is invalid
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <Box w="100%" h="100%" alignItems="center">
            <Box p="$6" w="100%" height={400} backgroundColor={colors.primary} borderBottomEndRadius={100} borderBottomLeftRadius={100}>
                <VStack space="2xl" alignItems='center' mt="30%">
                    <Text fontFamily={fonts.bold}>
                        <Heading lineHeight={50} fontSize="$4xl" color={colors.white} >Welcome back!</Heading>
                    </Text>
                    <Text lineHeight={25} fontSize="$xl" color={colors.white} fontFamily={fonts.regular}>Log in to IsKlutter now.</Text>
                </VStack>
            </Box>

            <Box p="$6" w="100%" maxWidth="$120" top={-180}>
                <Box backgroundColor={colors.white} p="$2" borderRadius={10}>
                    <VStack space="2xl">
                        <FormControl size="2xl" p="$2" pt="$5">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold} >Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%" borderRadius={10}>
                                <InputField
                                    type="email"
                                    placeholder="example@up.edu.ph"
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                    fontFamily={fonts.regular}
                                    fontSize={14}
                                />
                            </Input>
                        </FormControl>
                    </VStack>

                    <VStack space="xl" p="$2">
                        <FormControl size="md" py="$2">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold} >Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%" borderRadius={10}>
                                <InputField
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    fontFamily={fonts.regular}
                                    fontSize={14}
                                />
                            </Input>
                        </FormControl>
                    </VStack>

                    <VStack space="lg" pt="$2" pb="$2" width="100">
                        <Button size="sm" backgroundColor={colors.primary} onPress={handleLogin} borderRadius={10}>
                            <ButtonText fontFamily={fonts.bold} >{loading ? 'Logging In' : 'Log In' }</ButtonText>
                        </Button>
                    </VStack>
                </Box>
                
                <Box w="100%" mt="$5" alignItems="center">
                    <Text fontSize="$md" fontFamily={fonts.regular}>Don't have an account yet? <Text color={colors.secondary} fontFamily={fonts.bold} onPress={() => navigation.navigate(Routes.SIGNUP)}>Sign up</Text></Text>
                </Box>

            </Box>
        </Box>
    );
}
