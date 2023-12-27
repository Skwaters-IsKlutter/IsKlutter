import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Image,
    Pressable
} from '@gluestack-ui/themed';
import TagLabel from '../components/TagLabel.js';
import colors from '../config/colors.js';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'; 

export default function ItemCard( { productImage, productPrice, productName, productSeller, toListing, tags } ) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const constructImageUrl = async (imagePath) => {
            const storage = getStorage();
            const imageRef = ref(storage, imagePath);
            try {
                const url = await getDownloadURL(imageRef);
                console.log('URL: ', url);
                setImageUrl(url);
            } catch (error) {
                console.error('Error getting download URL:', error);
            }
        };

        if (productImage && typeof productImage === 'string') {
            constructImageUrl(productImage);
        }
    }, [productImage]);
      
    return (
        <Pressable onPress={toListing}>
            <Box bg={colors.white} borderRadius={10} width={150} maxHeight={256} m="2%" flex={1} overflow="hidden">
                <Box p="$2">
                    <VStack space="xs" p={0}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} h={100} w="auto" alt="icon" borderTopLeftRadius={5} borderTopRightRadius={5} />
                        ) : (
                            <Text>Rendering Image</Text>
                        )}
                        <Heading fontSize="$xl" color={colors.secondary}>
                            {`PHP ${productPrice}`}
                        </Heading>
                    </VStack>

                    <VStack space="xs" p={0}>
                        <Text fontSize="$md" fontWeight="$bold">{productName}</Text>
                        <Text fontSize="$sm" color={colors.gray}>{productSeller}</Text>
                    </VStack>

                    <HStack space="xs" p={0} flexWrap="wrap">{tags}</HStack>
                </Box>
            </Box>
        </Pressable>
    )
}