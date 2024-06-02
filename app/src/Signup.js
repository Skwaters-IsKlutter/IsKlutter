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
    Text
} from '@gluestack-ui/themed';

import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { FIREBASE_APP } from '../../config/firebase';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import Routes from '../components/constants/Routes.js';

const db = getFirestore(FIREBASE_APP);

export default function SignupScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isUsernameUnique = async (username) => {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const usernameSnapshot = await getDocs(q);
        return usernameSnapshot.empty;
    };

    const handleSignup = async () => {
        try {
            setLoading(true);
            setError(null);

            if (email && password && username && password === retypePassword) {
                const uniqueUsername = await isUsernameUnique(username);

                if (!email.includes('@up.edu.ph')) {
                    setError('Please use a valid email address with @up.edu.ph domain.');
                    setLoading(false);
                    Alert.alert("Signup Failed", "Please use a valid UP email address."); // Alert the user to use a valid email address
                    return;
                }

                if (password.length < 6) {
                    setError('Error creating user. Password must be at least 6 characters long.');
                    Alert.alert("Signup Failed", "Invalid password. Please use a password with 6 or more characters.");
                    return;
                }

                if (!uniqueUsername) {
                    setError('Username is already taken. Please choose a different one.');
                } else {
                    const response = await createUserWithEmailAndPassword(auth, email, password);
                    const defaultImgURL = "https://firebasestorage.googleapis.com/v0/b/isklutterdb.appspot.com/o/profileImages%2Fprofile-holder.jpg?alt=media&token=c026e2ce-062b-4952-a5a3-8232cb3b85d5";

                    try {
                        await addDoc(collection(db, 'users'), {
                            userID: response.user.uid,
                            username: username,
                            email: email,
                            userProfileImg: defaultImgURL, // Added userProfileImg
                        });
                        console.log('User account created successfully with ID:', response.user.uid);
                        navigation.navigate(Routes.LOGIN); // Navigate to login page if successful
                        Alert.alert("Signup Successful", "Please log in."); // Alert the user on successful signup

                    } catch (error) {
                        console.error('Error adding document:', error);
                        setError('Error creating user. Please try again.');
                    }
                }
            } else {
                setError('Please fill in all fields and make sure passwords match.');
                Alert.alert("Signup Failed", "Please fill in all fields and make sure passwords match."); // Alert the user to invalid signup details
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Box w="100%" h="100%" justifyContent="center" alignItems="center">
            <Box
                p="$6"
                w="100%"
                height={400}
                backgroundColor={colors.primary}
                borderBottomEndRadius={100}
                borderBottomLeftRadius={100}
            >
                <VStack space="xs" mt="35%" alignItems="center">
                    <Text fontFamily={fonts.bold}>
                        <Heading lineHeight={60} fontSize="$4xl" color={colors.white} >New here?</Heading>
                    </Text>
                    <Text lineHeight={25} fontSize="$xl" color={colors.white} fontFamily={fonts.regular}>Sign up to start decluttering.</Text>
                </VStack>
            </Box>

            <Box p="$6" w="100%" maxWidth="$96 " top={-180}>
                <Box backgroundColor={colors.white} p="$2" borderRadius={10}>
                    <VStack space="xl" py="$3" p="$2" pt="$5">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold} >Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
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

                    <VStack space="xl" py="$3" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold} >Username</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
                                <InputField
                                    type="username"
                                    defaultValue=""
                                    placeholder="Enter username"
                                    value={username}
                                    onChangeText={(text) => setUsername(text)}
                                    fontFamily={fonts.regular}
                                    fontSize={14}
                                />
                            </Input>
                        </FormControl>
                    </VStack>

                    <VStack space="xl" py="$2" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold} >Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
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

                    <VStack space="xl" py="$2" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary} fontFamily={fonts.bold}>Re-enter Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
                                <InputField
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={retypePassword}
                                    onChangeText={(text) => setRetypePassword(text)}
                                    fontFamily={fonts.regular}
                                    fontSize={14}
                                />
                            </Input>
                        </FormControl>
                    </VStack>

                    <VStack space="lg" pt="$4" pb="$2">
                        <Button size="sm" 
                                backgroundColor={colors.primary} 
                                onPress={handleSignup} 
                                disabled={loading}
                                borderRadius={10}>
                            <ButtonText fontFamily={fonts.bold} >{loading ? 'Signing Up' : 'Sign Up'}</ButtonText>
                        </Button>
                    </VStack>
                </Box>

                <Box w="100%" mt="$5" alignItems="center">
                    <Text fontSize="$md" fontFamily={fonts.regular} >Already have an account? <Text color={colors.secondary} fontFamily={fonts.bold} fontSize="$md" onPress={() => navigation.navigate(Routes.LOGIN)}>Sign in</Text></Text>
                </Box>
                
            </Box>
        </Box>
    )
};
