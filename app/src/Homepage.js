import React from 'react';
import {
    HStack,
    VStack,
    Heading,
    Image,
    Box, 
    Button, 
    ButtonText, 
    FormControl, 
    Input, 
    InputField,
    Text,
    ScrollView,
    Pressable
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';

import colors from '../config/colors.js'

export default function HomepagePage() {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeader />
            
            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                {/*Listing Box Container*/}
                <ScrollView>
                    <HStack space="xs" flexWrap="wrap">
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                        <ItemCard />
                    </HStack>
                </ScrollView>
            </Box>
        
            



            {/*Dashboard */}
            {/* <Box top="90%" position="absolute" h="20%" width="100%" backgroundColor="$green" borderRadius={50} alignItems='center'>
                <HStack space="xs" p="$5">
                    <Button variant="solid"  backgroundColor={colors.secondary} >
                        <ButtonText sx={{
                            color: colors.medium
                        }}>Listings</ButtonText>
                    </Button>
                    <Button variant="solid"  backgroundColor={colors.secondary}>
                        <ButtonText sx={{
                            color: colors.medium
                        }}>Community</ButtonText>
                    </Button>     
                    <Button variant="solid"  backgroundColor={colors.secondary}>
                        <ButtonText sx={{
                            color: colors.medium
                        }}>Profile</ButtonText>
                    </Button>        
                </HStack>   
            </Box> */}

        </Box>
    )
}