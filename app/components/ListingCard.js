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
    ButtonText,
} from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { doc, deleteDoc } from 'firebase/firestore'
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
      // Handle the case where there is no logged-in user
      return null;
    }
};

export default function ListingCard({ productID, productName, productImage, productPrice, productDesc, sellerName, sellerID, sellerChat, tags }) {
    const navigation = useNavigation();
    const currentUserId = getCurrentUserID();
    console.log(productID);

    const handleChatPress = () => {
        navigation.navigate(Routes.PRIVATEMESSAGE, { recipient: sellerName });
    };

    const isCurrentUserSeller = () => {
        const result = sellerID === currentUserId;
    
        if (result) {
            console.log('Current user is the seller.');
        }
    
        return result;
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
                            // Delete the document from the 'listings' collection in Firestore
                            await deleteDoc(doc(database, 'listings', productID));
                            console.log(`Product with ID ${productId} deleted successfully.`);

                            // Go back to the previous screen (listings page)
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
            <VStack space="md" pb="$2">
                {productImage && productImage.uri ? (
                    <Image source={{ uri: productImage.uri }} h={230} w="100%" alt="item" borderRadius={3} />
                ) : (
                    // You can replace this with a placeholder image or some other content
                    <Text>No Image</Text>
                )}
            </VStack>

            {/* Item name and price */}
            <VStack space="sm" p="$2">
                <Heading fontSize="$2xl" color={colors.primary}>{productName}</Heading>
                
                <Text fontSize="$lg" color={colors.secondary} fontWeight="$bold">{`PHP ${productPrice}`}</Text>
            </VStack>

            {/* Tags */}
            <HStack space="sm" p="$2">
                {tags && tags?.map((tag, index) => (
                    <Text key={index}>{tag}</Text>
                ))}
            </HStack>

            {/* Description */}
            <VStack space="sm" p="$2">
                <Text fontSize="$md">{productDesc}</Text>
            </VStack>

            {/* Poster info */}
            <HStack justifyContent="space-between" flexDirection="row">
                <HStack space="sm" p="$2" alignItems="center">
                    {/* <Image source={sellerImage} h={35} w={35} alt="icon" borderRadius={100} /> */}
                    <Text color={colors.gray}>{sellerName}</Text>

                    {/* Conditionally render the delete button */}
                    {isCurrentUserSeller() && (
                        <Button
                            variant="solid"
                            size="sm"
                            backgroundColor={colors.red}
                            borderRadius={8}
                            onPress={() => onDelete(productID)}
                            alignSelf="flex-end"
                        >
                            <ButtonIcon>
                                <MaterialCommunityIcons name="delete" size={13} color={colors.white} />
                            </ButtonIcon>
                            <ButtonText color={colors.white} fontSize="$sm">
                                Delete
                            </ButtonText>
                        </Button>
                    )}

                    {/* Chat button */}
                    <Button
                        variant="solid"
                        size="sm"
                        backgroundColor={colors.primary}
                        borderRadius={8}
                        onPress={handleChatPress} // Use the function to navigate and pass sellerName
                        alignSelf="flex-end"
                    >
                        {/* Chat button content */}
                        <ButtonIcon>
                            <MaterialCommunityIcons name="chat" size={13} color={colors.white} />
                        </ButtonIcon>
                        <ButtonText color={colors.white} fontSize="$sm">Chat</ButtonText>
                    </Button>
                </HStack>
            </HStack>
        </Box>
    )
}