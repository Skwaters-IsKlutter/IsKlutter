import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonIcon,
    Pressable
} from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFirestore, addDoc, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import fonts from '../config/fonts.js';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

const database = getFirestore(FIREBASE_APP);
const auth = getAuth();

const getCurrentUserID = () => {
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      return currentUser.uid;
    } else {
      return null;
    }
};

export default function ListingCard({ productID, productName, productImage, productPrice, productDesc, sellerName, sellerID, sellerImageURL, tags, timestamp }) {
    
    const navigation = useNavigation();
    const currentUserId = getCurrentUserID();

    const handleSellerProfilePress = () => {
        navigation.navigate(Routes.VIEWPROFILE, { sellerID });
    };
    
    const isCurrentUserSeller = () => {
        return sellerID === currentUserId;
    };

    const onDelete = async (productId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this product?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(database, 'listings', productId));
                            
                            const commentsQuery = query(collection(database, 'ListingsComments'), where('itemId', '==', productId));
                            const commentsSnapshot = await getDocs(commentsQuery);
                            commentsSnapshot.forEach(async (commentDoc) => {
                                await deleteDoc(commentDoc.ref);
                            });

                            Alert.alert("Success", "Product deleted successfully.", [{ text: "OK" }])
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const handleChatPress = async () => {
        try {
            const userQuery = query(collection(database, 'users'), where('userID', '==', sellerID));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const sellerData = querySnapshot.docs[0].data();
                const sellerUsername = sellerData.username;
                navigation.navigate(Routes.PRIVATEMESSAGE, { recipient: sellerUsername, userProfileImg: sellerImageURL });
            } else {
                console.error('Seller not found');
            }
        } catch (error) {
            console.error('Error fetching seller username:', error);
        }
    };

    return (
        <Box p="$3" w="100%" backgroundColor="$white">
            {isCurrentUserSeller() && (
                <Button
                    variant="solid"
                    size="sm"
                    backgroundColor="$red600"
                    borderRadius={8}
                    onPress={() => onDelete(productID)}
                    position="absolute"
                    top={15}
                    right={15}
                    zIndex={1}
                >
                    <ButtonIcon>
                        <MaterialCommunityIcons name="delete" size={15} color={colors.white}/>
                    </ButtonIcon>
                </Button>
            )}
            <VStack space="md" pb="$2">
                {productImage && productImage.uri ? (
                    <Image source={{ uri: productImage.uri }} h={300} w="100%" alt="item" borderRadius={3} />
                ) : (
                    <Text>No Image</Text>
                )}
            </VStack>

            <HStack space="sm" pt="$6" pl ="$2">
                {tags && tags?.map((tag, index) => (
                    <Text key={index} >{tag}</Text>
                ))} 
            </HStack>

            <VStack space="sm" p="$2">
                <HStack w="100%" justifyContent="space-between">
                    <Text fontSize="$3xl" color={colors.primary} lineHeight={40} fontFamily={fonts.semibold}>{productName}</Text>   
                </HStack>
                <HStack justifyContent='space-between'>
                    <Text fontSize="$xl" color={colors.secondary}  fontFamily={fonts.bold}>{`₱ ${productPrice}`}</Text>
                    <Text fontSize="$sm" color={colors.black} fontFamily={fonts.regular}>{timestamp}</Text>
                
                </HStack>
            </VStack>

            

            <VStack pt="$5" pl ="$2">
                <Text fontSize="$lg"  color='$black' fontFamily={fonts.semibold}>Description</Text>
            </VStack>
            
            <HStack justifyContent="space-between" flexDirection="row">
                <VStack space="sm" p="$2">
                    <Text fontSize="$md" fontFamily={fonts.regular}>{productDesc}</Text>
                </VStack>
            </HStack>

            <VStack pt="$5" pl ="$2">
                <Text fontSize="$md" color='$black' fontFamily={fonts.semibold}>Seller</Text>
            </VStack>
            
            <HStack justifyContent="space-between" flexDirection="row">
                <HStack w="100%" justifyContent="space-between">
                    <HStack space="md" p="$2" alignItems="center">   
                        <Image source={sellerImageURL} h={45} w={45} alt="icon" borderRadius={100} /> 
                        <Text color={colors.black} fontSize={15} onPress={handleSellerProfilePress} fontFamily={fonts.regular}>{sellerName}</Text>
                        <HStack bgColor={colors.primary} alignItems='center' p="$1" borderRadius={10} ml={15}>
                            <Pressable onPress={handleChatPress} pl={5} mt={5} pr={5} >
                                <MaterialCommunityIcons name="chat" color={colors.white} size={25} />
                            </Pressable>
                            <Text color={colors.white} pr={5}  fontFamily={fonts.semibold} pt={2}>Chat</Text>
                        </HStack>
                    </HStack>
                </HStack>
            </HStack>
        </Box>
    )
}
