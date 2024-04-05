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

                if (!uniqueUsername) {
                    setError('Username is already taken. Please choose a different one.');
                } else {
                    const response = await createUserWithEmailAndPassword(auth, email, password);
                    const defaultImgURL = "https://firebasestorage.googleapis.com/v0/b/isklutterfinal.appspot.com/o/profileImages%2Fprofile-holder.jpg?alt=media&token=8763c0e7-c1a4-40f1-a9ce-91f9164d71ae";

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
                <VStack space="xs" mt={90} alignItems="center">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.white}>New here?</Heading>
                    <Heading lineHeight={30} fontSize="$2xl" color={colors.white}>Sign up to start decluttering.</Heading>
                </VStack>
            </Box>

            <Box p="$6" w="100%" maxWidth="$96 " top={-180}>
                <Box backgroundColor={colors.white} p="$2" borderRadius={10}>
                    <VStack space="xl" py="$3" p="$2" pt="$5">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary}>Email</FormControlLabelText>
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

                    <VStack space="xl" py="$3" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary}>Username</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
                                <InputField
                                    type="username"
                                    defaultValue=""
                                    placeholder="Enter username"
                                    value={username}
                                    onChangeText={(text) => setUsername(text)}
                                />
                            </Input>
                        </FormControl>
                    </VStack>

                    <VStack space="xl" py="$2" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary}>Password</FormControlLabelText>
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

                    <VStack space="xl" py="$2" p="$2">
                        <FormControl size="md">
                            <FormControlLabel mb="$2">
                                <FormControlLabelText color={colors.secondary}>Re-enter Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
                                <InputField
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={retypePassword}
                                    onChangeText={(text) => setRetypePassword(text)}
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
                            <ButtonText>{loading ? 'Signing Up' : 'Sign Up'}</ButtonText>
                        </Button>
                    </VStack>
                </Box>

                <Box w="100%" mt="$5" alignItems="center">
                    <Text fontSize="$md">Already have an account? <Text color={colors.secondary} fontWeight="$black" fontSize="$md" onPress={() => navigation.navigate(Routes.LOGIN)}>Sign in</Text></Text>
                </Box>
                
            </Box>
        </Box>
    )
};
