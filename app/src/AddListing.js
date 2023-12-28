import React, { useState, useEffect }  from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box,
    ScrollView,
    Button,
    ButtonText,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import AddListingBox from '../components/AddListingBox.js';
import { collection, addDoc, getDoc, doc, query, where, getDocs, setDoc} from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

import colors from '../config/colors.js'


export default function AddListingPage() {
    const navigation = useNavigation();
    const [listingData, setListingData] = useState({
        listingImage: require("../../assets/img/item.jpg"),
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

            //const user = auth.currentUser; // User authenticated
            //const uid = user.uid;

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
                key: newListingId,
                username: username,
                ...listingData,
                listingImage: storagePath,
                listingImageURL: downloadURL,
            });

                console.log('Listing Data before adding to Firestore: ', {
                    username: username,
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
        // Parent box
        <ScrollView>
            <Box w="100%" h="100%" >
                {/*Search Bar*/}
                <SearchHeaderBack 
                    userIcon={ require("../../assets/img/usericon.jpg") } 
                    back={navigation.goBack} 
                />

                <Box p="$6" w="100%" maxWidth="$96">
                    <VStack space="xs" pb="$2">
                        <Heading lineHeight={60} fontSize="$3xl" color={colors.secondary}>
                            Sell Your Product
                        </Heading>
                    </VStack>

                    <Box bg={colors.medium} borderRadius={50} >
                        <VStack space="xs">
                            <AddListingBox 
                            listingImage={require("../../assets/img/item.jpg")} 
                            listingName={listingData.listingName}
                            listingPrice={listingData.listingPrice}
                            listingDescription={listingData.listingDescription}
                            listingTags={listingData.listingTags}
                            setListingData={setListingData} // Prop to update the state in AddListingBox
                            />
                        </VStack>
                    </Box>

                    <HStack p="$3" justifyContent='center'>
                        <Button 
                            variant="solid" 
                            size="sm" 
                            bg={colors.primary} 
                            borderRadius={10} 
                            m={5}
                            onPress={handlePostNow}
                            
                        >
                            <ButtonText color={colors.white} fontSize="$sm">
                                Post Now
                            </ButtonText>
                        </Button>

                        <Button 
                            variant="solid" 
                            size="sm" 
                            bg={colors.gray} 
                            borderRadius={10} 
                            m={5}
                            onPress={handleCancel}
                        >
                            <ButtonText color={colors.white} fontSize="$sm">
                                Cancel
                            </ButtonText>
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </ScrollView>
    );
}