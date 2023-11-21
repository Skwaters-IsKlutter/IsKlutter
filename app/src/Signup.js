import React, { useState } from 'react';
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
    InputField,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth} from '../../config/firebase'; // Import Firebase authentication
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import { FIREBASE_APP } from '../../config/firebase'; 
const db = getFirestore(FIREBASE_APP);

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function SignupScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState(''); 
    const [username, setUsername] = useState('');
    const [selectedColor, setSelectedColor] = useState(''); 
    const [error, setError] = useState(null);

    const handleSignup = async () => {
        try {
          if (email && password && username && selectedColor) {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User UID:', response.user.uid);
            try {
                const userDocRef = await addDoc(collection(db, 'users'), {
                  userID: response.user.uid,
                  username: username,
                  email: email,
                  color: selectedColor,
                });
                console.log('Document written with ID:', userDocRef.id);
              } catch (error) {
                console.error('Error adding document:', error);
              }
            } else {
                setError('Please fill in all fields, including color selection.');
            }
        } catch (error) {
            setError(error.message);
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
                maxWidth="$96"
            >
                {/* Heading */}
                <VStack space="xs" pb="$12">
                    <Heading lineHeight={60} fontSize="$5xl">New here?</Heading>
                    <Heading lineHeight={30} fontSize="$2xl">Sign up to start decluttering.</Heading>
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

               {/* Re-enter password input */}
            <VStack space="xl" py="$2">
                <FormControl size="md">
                    <FormControlLabel mb="$2">
                        <FormControlLabelText>Re-enter Password</FormControlLabelText>
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

             {/* Dropdown color choose */}
             <VStack space="xl" py="$3">
                    <FormControl>
                    <VStack space="xl" py="$3">
                    <FormControl>
                    <FormControlLabel mb="$2">
                        <FormControlLabelText>Choose Color</FormControlLabelText>
                    </FormControlLabel>
                    <Picker
                        selectedValue={selectedColor}
                        onValueChange={(itemValue) => setSelectedColor(itemValue)}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Red" value="red" />
                        <Picker.Item label="Orange" value="orange" />
                        <Picker.Item label="Green" value="green" />
                        <Picker.Item label="Blue" value="blue" />
                        <Picker.Item label="Indigo" value="indigo" />
                        <Picker.Item label="Violet" value="violet" />
                        {/* Add more color options as needed */}
                    </Picker>
                    </FormControl>
                </VStack>
                        
                    </FormControl>
                </VStack>

            {/* Submit button */}
            <VStack space="lg" pt="$4">
                <Button size="sm" backgroundColor={colors.primary} onPress={handleSignup}>
                    <ButtonText>Sign Up</ButtonText>
                </Button>
            </VStack>
            </Box>

            {/* Go to sign up */}
            <Box flexDirection="row" top={700} position="absolute">
                <Button variant="solid" m="$7" size="sm" backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.LOGIN)}>
                    <ButtonText sx={{
                        color: colors.medium
                    }}>Already have an account? Sign in</ButtonText>
                </Button>
            </Box>
        </Box>
    )
}