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
                    <Image source={{ uri: productImage.uri }} h={230} w="100%" alt="item" borderRadius={3} />
                ) : (
                    <Text>No Image</Text>
                )}
            </VStack>

            <VStack space="sm" p="$2">
                <HStack w="100%" justifyContent="space-between">
                    <Heading fontSize="$2xl" color={colors.primary}>{productName}</Heading>   
                </HStack>
                <Text fontSize="$sm" color={colors.gray} fontWeight="$bold" >{timestamp}</Text>
                <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{`PHP ${productPrice}`}</Text>
            </VStack>

            <HStack space="sm" p="$2">
                {tags && tags?.map((tag, index) => (
                    <Text key={index}>{tag}</Text>
                ))} 
            </HStack>
            
            <HStack justifyContent="space-between" flexDirection="row">
                <VStack space="sm" p="$2">
                    <Text fontSize="$md">{productDesc}</Text>
                </VStack>
            </HStack>
            
            <HStack justifyContent="space-between" flexDirection="row">
                <HStack w="100%" justifyContent="space-between">
                    <HStack space="sm" p="$2" alignItems="center">   
                        <Image source={sellerImageURL} h={45} w={45} alt="icon" borderRadius={100} /> 
                        <Text color={colors.black} fontSize={15} onPress={handleSellerProfilePress}>{sellerName}</Text>
                    </HStack>
                </HStack>
            </HStack>
        </Box>
    )
}
