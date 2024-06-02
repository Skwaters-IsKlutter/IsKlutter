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
} from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';
import { Alert } from 'react-native';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import fonts from '../config/fonts.js';

const getCurrentUserID = () => {
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      return currentUser.uid;
    } else {
      return null;
    }
};

export default function ListingCard({ productID, productName, productImage, productPrice, productDesc, sellerName, sellerID, sellerImageURL, tags, timestamp }) {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })
    
    
    
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
                    <Text fontSize="$3xl" color={colors.primary} lineHeight={40} fontFamily="Poppins_600SemiBold">{productName}</Text>   
                </HStack>
                <HStack justifyContent='space-between'>
                    <Text fontSize="$xl" color={colors.secondary}  fontFamily={fonts.bold}>{`₱ ${productPrice}`}</Text>
                    <Text fontSize="$sm" color={colors.black} fontFamily={fonts.regular}>{timestamp}</Text>
                
                </HStack>
            </VStack>

            

            <VStack pt="$5" pl ="$2">
                <Text fontSize="$lg"  color='$black' fontFamily="Poppins_600SemiBold">Description</Text>
            </VStack>
            
            <HStack justifyContent="space-between" flexDirection="row">
                <VStack space="sm" p="$2">
                    <Text fontSize="$md" fontFamily="Poppins_400Regular">{productDesc}</Text>
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
                    </HStack>
                </HStack>
            </HStack>
        </Box>
    )
}
