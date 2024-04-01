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
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, storage } from '../../config/firebase';
import { getFirestore, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { FIREBASE_APP } from '../../config/firebase'; 
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import temporaryImage from '../../assets/img/profile-holder.jpg'; // Import the temporary image

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
                    return; // Stop further execution
                }

                if (!uniqueUsername) {
                    setError('Username is already taken. Please choose a different one.');
                } else {
                    const userResponse = await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User UID:', userResponse.user.uid);

                    try {
                        let imageURL = '';
                        // Get the temporary image from the assets folder
                        const storage = getStorage();
                        const imageRef = storageRef(storage, `profileImages/${userResponse.user.uid}`);
                        // const response = await fetch(temporaryImage);
                        // const blob = await response.blob();

                        // const uploadTask = uploadBytes(imageRef, blob);   
                        // const snapshot = await uploadTask;                     
                        

                        // // Get the download URL of the uploaded image
                        // imageUrl = await getDownloadURL(snapshot.ref);
                    
                        // Update user document in Firestore with the temporary profile image URL
                        const userDocRef = await addDoc(collection(db, 'users'), {
                            email: email,
                            userBio: "",
                            userID: userResponse.user.uid,
                            userProfile: username,
                            // userProfileImg: imageUrl, // Add the temporary profile image URL
                            username: username,
                        });
                    
                        console.log('Document written with ID:', userDocRef.id);
                        navigation.navigate(Routes.LOGIN);
                    } catch (error) {
                        console.error('Error adding document:', error);
                        setError('Error creating user. Please try again.');
                    }
                }
            } else {
                setError('Please fill in all fields and make sure passwords match.');
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                height={400}
                backgroundColor={colors.primary}
                borderBottomEndRadius={100}
                borderBottomLeftRadius={100}
            >
                {/* Heading */}
                <VStack space="xs"mt={90} alignItems='center' >
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.white}>New here?</Heading>
                    <Heading lineHeight={30} fontSize="$2xl" color={colors.white}>Sign up to start decluttering.</Heading>
                </VStack>
            
            </Box>
            <Box p="$6" w="100%" maxWidth="$96 " top={-180}>
                <Box backgroundColor={colors.white} p="$2" borderRadius={10}>
                {/* Email input */}
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


                {/* Username input */}
                <VStack space="xl" py="$3" p="$2">
                    <FormControl
                        size="md"
                        isDisabled={false}
                        isInvalid={false}
                        isReadOnly={false}
                        isRequired={false}
                    >
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

             {/* Password input */}
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

               {/* Re-enter password input */}
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

            {/* Submit button */}
            <VStack space="lg" pt="$4">
                <Button size="sm" 
                        backgroundColor={colors.primary} 
                        onPress={handleSignup} 
                        disabled={loading}
                        borderRadius={10}>
                    <ButtonText>{loading ? 'Signing Up...' : 'Sign Up'}</ButtonText>
                </Button>
            </VStack>
            </Box>
            </Box>
            

            {/* Go to sign up */}
            <Box flexDirection="row" top={700} position="absolute">
                <Button variant="solid" m="$7" size="sm" backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.LOGIN)}>
                    <ButtonText sx={{
                        color: colors.white
                    }}>Already have an account? Sign in</ButtonText>
                </Button>
            </Box>
        </Box>
    )
};
