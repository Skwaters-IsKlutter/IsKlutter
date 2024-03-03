import React from 'react';
import { Box, VStack, HStack, Heading, Text, Image, Pressable,Button, ButtonText, ScrollView } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Routes from '../components/constants/Routes.js';

export default function BidItemCard({ productImage, productPrice, productName, productSeller, sellerID, toSpecificBidding, tags }) {
    // const isImageUrl = typeof productImage === 'string';
    const navigation = useNavigation();

    return (
       
            <Box bg={colors.white} borderRadius={10} width="95%" maxHeight={350} m={10}>
                <Box p="$">
                    <HStack space="xs" p={0}>
                        <Box borderRadius={10}
                            maxheight={350}
                            width={150}
                            m={10}
                            backgroundColor={colors.black}>
                            
                        </Box>
                        {/* {isImageUrl && (
                            <Image
                                // source={{ uri: productImage }}
                                style={{ height: 100, width: '100%'}}
                                resizeMode="cover"
                                alt="icon"
                                borderTopLeftRadius={5}
                                borderTopRightRadius={5}
                                bgColor={colors.black}
                            />
                        )}
                        {!isImageUrl && (
                            <Text>No Image Available</Text>
                        )} */}
                        <VStack>
                            <Heading fontSize="$xl" color={colors.primary}>ITEM NAME </Heading>
                            <Heading fontSize="$md" color={colors.secondary} p={0}>Current Bid</Heading>
                            <Heading fontSize="$md" color={colors.black}>Remaining Time</Heading>
                            <Button bgColor={colors.primary} p={5} mb={10} borderRadius={50} onPress={() => navigation.navigate(Routes.SPECIFICBIDDING)}>
                                <ButtonText>Bid Now</ButtonText>
                            </Button>
                        </VStack>
                    </HStack>
                </Box>
            </Box>
    );
}
