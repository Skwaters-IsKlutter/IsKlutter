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
    Text
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { collection, doc, query, where, getDocs, setDoc} from 'firebase/firestore';
import { storage, storageRef, uploadBytes,  database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

import AddListingBox from '../components/AddListingBox.js';

import colors from '../config/colors.js';

export default function AddListingPage() {
    const navigation = useNavigation();
    const [listingData, setListingData] = useState({
        listingImage: null,
        listingName: '',
        listingPrice: '',
        listingDescription: '',
        listingTags: [],
        bidding: true,
       
    });
    const [username, setUsername] = useState('');
    const [isFirestoreOnline, setIsFirestoreOnline] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedDays, setSelectedDays] = useState(1);

    useEffect(() => {
        fetchUsername();
        checkFirestoreStatus();
    }, []);

    const fetchUsername = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userQuery = query(collection(database, 'users'), where('userID', '==', user.uid));
                const userQuerySnapshot = await getDocs(userQuery);
                if (userQuerySnapshot.docs.length > 0) {
                    const retrievedUsername = userQuerySnapshot.docs[0].data().username;
                    setUsername(retrievedUsername);
                }
            }
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const checkFirestoreStatus = async () => {
        try {
            await getDocs(collection(database, 'some-collection'));
            setIsFirestoreOnline(true);
        } catch (error) {
            console.error('Error checking Firestore status:', error);
            setIsFirestoreOnline(false);
        }
    };

    const handleBiddingTimeChange = (value) => {
        setSelectedDays(parseInt(value));
        console.log("Selected days:", value); // Add this line to log the selected value
    };

  

    const handlePostNow = async () => {
        try {
            setLoading(true);
    
            if (!isFirestoreOnline) {
                Alert.alert("Error", "Please check your internet connection.");
                throw new Error('Firestore is currently offline. Please check your internet connection and try again.');
            }
    
            if (!listingData.listingName || !listingData.listingPrice || !listingData.listingDescription || !listingData.listingImage) {
                Alert.alert("Error", "Please fill in all required fields.");
                throw new Error('Please fill in all required fields (Listing Title, Price, Description, and Image).');
            }
    
            const listingPrice = parseFloat(listingData.listingPrice);
            if (isNaN(listingPrice)) {
                Alert.alert("Error", "Listing price must be a number.");
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
            const metadata = { contentType: 'image/jpeg' };
            await uploadBytes(imageRef, file, metadata);
            const downloadURL = await getDownloadURL(imageRef);
    
            // Calculate timestamp based on selected bidding time
            const currentDate = new Date();
            const adjustedTimestamp = new Date(currentDate.setDate(currentDate.getDate() + selectedDays));
    
            const listingDataFirestore = {
                sellerID: uid,
                key: newListingId,
                productSeller: username,
                ...listingData,
                listingPrice: listingPrice,
                listingImage: storagePath,
                listingImageURL: downloadURL,
                endTime: adjustedTimestamp 
            };
    
            await setDoc(docRef, listingDataFirestore);
            setListingData({
                listingImage: null,
                listingName: '',
                listingPrice: '',
                listingDescription: '',
                listingTags: [],
                bidding: true,
             
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error adding document: ', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleCancel = () => {
        navigation.goBack();
    };

    return (    
        <Box w="100%" h="100%">
           {/* Header */}
            <Box backgroundColor={colors.primary}>
                <HStack p="$2" w="100%" mt={25} alignItems="center" >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Heading lineHeight={50} fontSize={25} color={colors.white} m={10} >Add item to bid</Heading>
                </HStack>
            </Box>

      
            <Box w="100%" maxWidth="$96" flex={1}>
                 <ScrollView>
                    <Box>
                        <VStack space="xs">
                            <AddListingBox
                                    listingImage={require('../../assets/img/item.jpg')}
                                    listingName={listingData.listingName}
                                    listingPrice={listingData.listingPrice}
                                    listingDescription={listingData.listingDescription}
                                    listingTags={listingData.listingTags}
                                    setListingData={setListingData}
                            />
                        </VStack>
                    </Box>
                    <Box p={10} top={-30}>
                        <Text color={colors.secondary} fontWeight={600}>Select Bid Time</Text>
                        <Select onValueChange={(value) => { handleBiddingTimeChange(value); }}>
                            <SelectTrigger bg={colors.white}>
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
                                                <SelectItem label="5 days" value={5} />
                                    </SelectContent>
                            </SelectPortal>
                            </Select>
                    </Box>

                    <HStack p="$2" justifyContent="center" mb={10}>
                            <Button
                                variant="solid"
                                size="md"
                                bg={colors.secondary}
                                borderRadius={10}
                                onPress={handlePostNow}
                                disabled={loading}
                            >
                                <ButtonText color={colors.white} fontSize="$md">
                                    {loading ? 'Posting' : 'Post Now'}
                                </ButtonText>
                            </Button>
                            
                            <Button
                                variant="solid"
                                size="md"
                                bg={colors.gray}
                                borderRadius={10}
                                ml={10}
                                onPress={handleCancel}>
                                <ButtonText color={colors.white} fontSize="$md">
                                    Cancel
                                </ButtonText>
                            </Button>
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    );
}