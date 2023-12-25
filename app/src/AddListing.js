import React, { useState }  from 'react';
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
import ItemCard from '../components/ItemCard.js';
import TagLabel from '../components/TagLabel.js';
import AddListingBox from '../components/AddListingBox.js';

import { collection, addDoc } from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';

import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';

export default function AddListingPage() {
    const navigation = useNavigation();
    const [listingData, setListingData] = useState({
        listingImage: require("../../assets/img/item.jpg"),
        listingName: "",
        listingPrice: "",
        listingDescription: "",
        listingTags: [],
      });

    const handlePostNow = async () => {
    try {
        // Upload the image to Firebase Storage
        const storagePath = `images/${listingData.listingName}`;
        const file = listingData.listingImage; // Adjust this based on how you handle image selection
        const imageRef = storageRef(storage, storagePath);
        await uploadBytes(imageRef, file);

            console.log('Image uploaded to Firebase Storage');

        // Add the listing data to Firestore with the image URL
        const user = auth.currentUser; // User authenticated
        const uid = user.uid;

        // Add the listing data to Firestore with the image URL
        const docRef = await addDoc(collection(database, 'listings'), {
            userID: uid,
            ...listingData,
            listingImage: storagePath,
        });

            console.log('Listing Data before adding to Firestore: ', {
                ...listingData,
                listingTags: Array.isArray(listingData.listingTags) ? listingData.listingTags : [],
                listingImage: storagePath,
            });

            console.log('Document written with ID: ', docRef.id);
        // Remove any functions from listingData before sending to Firestore
        const { listingTags, ...cleanListingData } = listingData;
    
        // Reset the form or navigate to a different screen
        // You can implement this based on your app flow
        setListingData({
            listingImage: require("../../assets/img/item.jpg"),
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
                            setListingData={setListingData} // Add this prop to update the state in AddListingBox
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