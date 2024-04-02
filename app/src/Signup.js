import React, { useState } from 'react';
import { Text, Image, TouchableOpacity, } from 'react-native';
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
import { getFirestore, addDoc, collection, where, query, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP } from '../../config/firebase';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker for selecting profile picture

const db = getFirestore(FIREBASE_APP);

export default function SignupScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null); // State to store selected profile image

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
    
                    let imageUrl = '';
                    if (profileImage) {
                        const storage = getStorage();
                        const imageRef = storageRef(storage, `profileImages/${userResponse.user.uid}`);
                        const response = await fetch(profileImage.assets[0].uri);
                        const blob = await response.blob();
    
                        const uploadTask = uploadBytes(imageRef, blob);
                        const snapshot = await uploadTask;
    
                        imageUrl = await getDownloadURL(snapshot.ref);
                    }
    
                    // Wait for the user document to be added to the collection
                    const userDocRef = await addDoc(collection(db, 'users'), {
                        email: email,
                        userBio: '',
                        userID: userResponse.user.uid,
                        userProfile: username,
                        userProfileImg: imageUrl,
                        username: username,
                    });
    
                    console.log('Document written with ID:', userDocRef.id);
                    navigation.navigate(Routes.LOGIN);
                }
            } else {
                setError('Please fill in all fields and make sure passwords match.');
            }
        } catch (error) {
            //console.error("error", error);
            //setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const handleChooseProfileImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            setError('Permission Denied: Camera roll permission is required to upload profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setProfileImage(result);
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
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.white}>
                        New here?
                    </Heading>
                    <Heading lineHeight={30} fontSize="$2xl" color={colors.white}>
                        Sign up to start decluttering.
                    </Heading>
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
                    <VStack space="lg" pt="$4">
                        <TouchableOpacity onPress={handleChooseProfileImage}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage.assets[0].uri }} style={styles.image} />
                            ) : (
                                <Text style={styles.text}>Choose Profile Picture</Text>
                            )}
                        </TouchableOpacity>
                    </VStack>
                    <VStack space="lg" pt="$4">
                        <Button size="sm" backgroundColor={colors.primary} onPress={handleSignup} disabled={loading}>
                            <ButtonText>{loading ? 'Signing Up...' : 'Sign Up'}</ButtonText>
                        </Button>
                    </VStack>
                </Box>
            </Box>
            <Box flexDirection="row" top={700} position="absolute">
                <Button
                    variant="solid"
                    m="$7"
                    size="sm"
                    backgroundColor={colors.secondary}
                    onPress={() => navigation.navigate(Routes.LOGIN)}
                >
                    <ButtonText
                        sx={{
                            color: colors.white,
                        }}
                    >
                        Already have an account? Sign in
                    </ButtonText>
                </Button>
            </Box>
        </Box>
    );
}

const styles = {
    text: {
        color: colors.black,
        fontSize: 16,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
};

