import React, { useState, useEffect } from 'react';
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
    Text,
    Input,
    InputField
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { collection, doc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { storage, storageRef, uploadBytes, database, auth } from '../../config/firebase';
import { getDownloadURL } from 'firebase/storage';

import AddBiddingBox from '../components/AddBiddingBox.js';
import BackHeader from '../components/BackHeader.js';

import colors from '../config/colors.js';
import fonts from '../config/fonts.js';

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
    const [bidIncrement, setBidIncrement] = useState('');

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

            const parsedBidIncrement = parseFloat(bidIncrement);
            if (isNaN(parsedBidIncrement)) {
                Alert.alert("Error", "Bidding increment must be a number.");
                throw new Error('Bidding increment must be a valid number.');
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
                endTime: adjustedTimestamp,
                bidIncrement: parsedBidIncrement,
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
            setBidIncrement(''); // Reset bid increment
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
            <BackHeader headerText="Post Bid" />

            <Box w="100%" flex={1} p="$3">
                <ScrollView>
                    <Box>
                        <VStack space="xs">
                            <AddBiddingBox
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
                        <Text color={colors.secondary} fontWeight={600} fontFamily={fonts.bold}>Select Bid Time</Text>
                        <Select onValueChange={(value) => { handleBiddingTimeChange(value); }}>
                            <SelectTrigger bg={colors.white} >
                                <SelectInput  placeholder="Select Time" />
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

                    <Box p={10} top={-30}>
                        <FormControl>
                            <FormControlLabel mb="$1">
                                <FormControlLabelText color={colors.secondary} fontWeight={600}  fontFamily={fonts.bold}>Bidding Increment</FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%" bg={colors.white} h='$10' borderRadius={10}>
                                <InputField
                                    value={bidIncrement}
                                    onChangeText={(text) => setBidIncrement(text)}
                                    keyboardType="numeric"
                                    placeholder="Enter bidding increment"
                                />
                            </Input>
                        </FormControl>
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
                            <ButtonText color={colors.white}  fontFamily={fonts.semibold}fontSize="$md">
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
                            <ButtonText color={colors.white} fontSize="$md"  fontFamily={fonts.semibold}>
                                Cancel
                            </ButtonText>
                        </Button>
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    );
}
