import React, { useState, useEffect }  from 'react';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Select,
    SelectTrigger,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectBackdrop,
    SelectContent,
    SelectPortal,
    Icon,
    SelectInput,
    SelectIcon,
    SelectItem,
    Pressable,
    HStack,
    Input,
    Checkbox,
    CheckIcon,
    CheckboxLabel,
    CheckboxIcon,
    InputField,
    InputSlot,
    InputIcon
} from '@gluestack-ui/themed';
// import DatePicker from 'react-native-date-picker'
import { useNavigation } from '@react-navigation/native';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import AddListingBox from '../components/AddListingBox.js';
import AddBiddingBox from '../components/AddBiddingBox.js';

import { Timestamp, collection, addDoc, getDoc, doc, query, where, getDocs, setDoc} from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../config/colors.js'


export default function AddBiddingPage() {
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
    const [enableBidding, setEnableBidding] = useState(false);
    const [biddingTime, setBiddingTime] = useState(3); // Default to 1 day
    const [date, setDate] = useState(new Date())
    
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

            if (!listingData.listingName || !listingData.listingPrice || !listingData.listingDescription || !listingData.listingImage) {
                throw new Error('Please fill in all required fields (Listing Title, Price, Description, and Image).');
            }

            const listingPrice = parseFloat(listingData.listingPrice);

            if (isNaN(listingPrice)) {
                throw new Error('Listing price must be a valid number.');
            }

            const user = auth.currentUser;
            const uid = user.uid;

            const docRef = doc(collection(database, 'listings'));
            const newListingId = docRef.id;

            const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            const sanitizedListingName = listingData.listingName.replace(/\s+/g, '');

            const storagePath = `images/${uniqueFilename}_${sanitizedListingName}.jpeg`;
            const file = listingData.listingImage;
            const imageRef = storageRef(storage, storagePath);
            const metadata = {
                contentType: 'image/jpeg',
            };

            await uploadBytes(imageRef, file, metadata);
            const downloadURL = await getDownloadURL(imageRef);

            let listingDataFirestore = {
                sellerID: uid,
                key: newListingId,
                productSeller: username,
                ...listingData,
                listingPrice: listingPrice,
                listingImage: storagePath,
                listingImageURL: downloadURL,
                bidding: enableBidding
            };
            
            if (enableBidding) {
                const endTimeTimestamp = Timestamp.fromMillis(Date.now() + biddingTime * 24 * 60 * 60 * 1000);
                listingDataFirestore = {
                    ...listingDataFirestore,
                    endTime: endTimeTimestamp,
                };
            }
            
            await setDoc(docRef, listingDataFirestore);

            setListingData({
                listingImage: null,
                listingName: "",
                listingPrice: "",
                listingDescription: "",
                listingTags: [],
            });

            navigation.goBack();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };


const handleBiddingTimeChange = (value) => {
    const selectedDays = parseInt(value);
    
    // Check if the selectedDays is a valid number
    if (!isNaN(selectedDays)) {
        setBiddingTime(selectedDays + 1); 
    }
};

    
    const handleBiddingCheckboxChange = () => {
        const output = enableBidding ? "Yes" : "No"; // check lungs
        console.log(output);
        setEnableBidding(!enableBidding);
        
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
                            Add Item to Bid
                        </Heading>
                    </HStack>
            </Box>
    
        <ScrollView>
            <Box w="100%" h="100%">
                {/*Search Bar*/}
                
                <Box  w="100%" maxWidth="$96" >
                   
                        <VStack space="xs" >
                            <AddBiddingBox 
                            listingImage={require("../../assets/img/item.jpg")} 
                            biddingName={listingData.listingName}
                            biddingPrice={listingData.listingPrice}
                            setListingData={setListingData} // Prop to update the state in AddListingBox
                            />

                            <Box p={10} top={-30}>
                            <FormControl m={10} >
                                    <FormControlLabel>
                                        <FormControlLabelText color={colors.secondary}>Bidding time</FormControlLabelText>
                                    </FormControlLabel>
                                    <Select onChange={(value) => handleBiddingTimeChange(value)}>
                                        <SelectTrigger>
                                            <SelectInput placeholder="Select Time" />
                                        </SelectTrigger>
                                        <SelectPortal>
                                            <SelectBackdrop />
                                            <SelectContent>
                                                <SelectDragIndicatorWrapper>
                                                    <SelectDragIndicator />
                                                </SelectDragIndicatorWrapper>

                                                <SelectItem label="1 day" value={1} />
                                                <SelectItem label="2 days" value={2} />
                                                <SelectItem label="3 days" value={3} />
                                                <SelectItem label="4 days" value={4} />
                                            </SelectContent>
                                        </SelectPortal>
                                    </Select>
                                </FormControl>
                            </Box>
                        </VStack>
                        

                       
                  
                       
                    </Box>
           
                    <HStack p="$2" justifyContent='center' mb={10}>
                        <Button 
                            variant="solid" 
                            size="md" 
                            bg={colors.primary} 
                            borderRadius={10} 
                            onPress={handlePostNow} >
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
           
        </ScrollView>
        </Box>
    );
}