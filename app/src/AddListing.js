import React, { useState, useEffect }  from 'react';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    Button,
    ButtonText,
    Pressable,
    HStack,
    Input,
    InputField,
    InputSlot,
    InputIcon
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import AddListingBox from '../components/AddListingBox.js';
import AddBiddingBox from '../components/AddBiddingBox.js';
import { collection, addDoc, getDoc, doc, query, where, getDocs, setDoc} from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../config/colors.js'

export default function AddListingPage() {
    const navigation = useNavigation();
    const [listingData, setListingData] = useState({
        listingImage: "",
        listingName: "",
        listingPrice: "",
        listingDescription: "",
        listingTags: [],
    });

    const [username, setUsername] = useState("");
    const [isFirestoreOnline, setIsFirestoreOnline] = useState(true); // New state to track Firestore online status

    const fetchUsername = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                // Use a query to find the document with the specified UID
                const userQuery = query(collection(database, 'users'), where('userID', '==', user.uid));
                const userQuerySnapshot = await getDocs(userQuery);
    
                if (userQuerySnapshot.docs.length > 0) {
                    const retrievedUsername = userQuerySnapshot.docs[0].data().username;
                    setUsername(retrievedUsername); // Set the username in the state
                }
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const checkFirestoreStatus = async () => {
        try {
            await getDoc(doc(database, 'some-collection', 'some-doc')); // Use an existing document for the check
            setIsFirestoreOnline(true);
        } catch (error) {
            console.error('Error checking Firestore status:', error);
            setIsFirestoreOnline(false);
        }
    };

    useEffect(() => {
            fetchUsername();
            checkFirestoreStatus();
    }, []);

    const handlePostNow = async () => {
        try {
            if (!isFirestoreOnline) {
                throw new Error('Firestore is currently offline. Please check your internet connection and try again.');
            }

            // Check if required fields are filled
            if (!listingData.listingName || !listingData.listingPrice || !listingData.listingDescription || Object.keys(listingData.listingImage).length === 0) {
                throw new Error('Please fill in all required fields (Listing Title, Price, Description, and Image).');
                // TODO: add a
            }

            const user = auth.currentUser; // User authenticated
            const uid = user.uid;

            // Generate a unique key for the new listing
            const docRef = doc(collection(database, 'listings'));   
            const newListingId = docRef.id;

            // Generate a unique filename using timestamp and random string
            const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;   
            
            // Remove spaces from the listing name for the image file name
            const sanitizedListingName = listingData.listingName.replace(/\s+/g, ''); 

            // Upload the image to Firebase Storage with a sanitized file name and ".jpeg" extension
            const storagePath = `images/${uniqueFilename}_${sanitizedListingName}.jpeg`;
            const file = listingData.listingImage;
            const imageRef = storageRef(storage, storagePath);
            // Set content type to image/jpeg
            const metadata = {
                contentType: 'image/jpeg',
            };
            
            // Use uploadBytes with metadata
            await uploadBytes(imageRef, file, metadata);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(imageRef);

            // Add the listing data to Firestore with the image URL
            await setDoc(docRef, {
                sellerID: uid,
                key: newListingId,
                productSeller: username,
                ...listingData,
                listingImage: storagePath,
                listingImageURL: downloadURL,
            });

                console.log('Listing Data before adding to Firestore: ', {
                    productSeller: username,
                    ...listingData,
                    listingTags: Array.isArray(listingData.listingTags) ? listingData.listingTags : [],
                    listingImage: storagePath,
                    listingImageURL: downloadURL,
                });
        
            // Reset the form and navigate to a different screen
            setListingData({
                listingImage: null,
                listingName: "",
                listingPrice: "",
                listingDescription: "",
                listingTags: [],
            });

            // Go back to the previous screen (listings page)
            navigation.goBack();

            } catch (error) {
            console.error('Error adding document: ', error);
            }
        };

        const handleCancel = () => {
        // Go back to the previous screen (listings page)
        navigation.goBack();
    };

    return (
        <Box backgroundColor={colors.white}>
            <Box backgroundColor={colors.primary} alignItems="center">
                    <HStack p="$2" w={400} mt={25} >
                        <Pressable onPress={navigation.goBack} ml={20} mt={10}>
                            <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30}/>
                        </Pressable>
                        <Heading lineHeight={50} fontSize={25} color={colors.white} m={45}>
                            Sell Your Product
                        </Heading>
                    </HStack>
            </Box>
    
        <ScrollView>
            <Box w="100%" h="100%">
                {/*Search Bar*/}
                
                <Box  w="100%" maxWidth="$96" >
                    <Box>
                        <VStack space="xs" >
                            <AddListingBox 
                            listingImage={require("../../assets/img/item.jpg")} 
                            listingName={listingData.listingName}
                            listingPrice={listingData.listingPrice}
                            listingDescription={listingData.listingDescription}
                            listingTags={listingData.listingTags}
                            setListingData={setListingData} // Prop to update the state in AddListingBox
                            />
                        </VStack>
                        <VStack>
                            <AddBiddingBox 
                            

                            />
                        </VStack>
                    </Box>

                    <HStack p="$2" justifyContent='center' mb={10}>
                        <Button 
                            variant="solid" 
                            size="md" 
                            bg={colors.primary} 
                            borderRadius={10} 
                            onPress={handlePostNow}
                            
                        >
                            <ButtonText color={colors.white} fontSize={"$md"}>
                                Post Now
                            </ButtonText>
                        </Button>

                        <Button 
                            variant="solid" 
                            size="md" 
                            bg={colors.gray} 
                            borderRadius={10} 
                            ml={10}
                            onPress={handleCancel}
                        >
                            <ButtonText color={colors.white} fontSize="$md">
                                Cancel
                            </ButtonText>
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </ScrollView>
        </Box>
    );
}