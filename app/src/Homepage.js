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
    Text
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';

import colors from '../config/colors.js'

export default function HomepagePage() {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%"  backgroundColor='lightgray'>
        
            {/*Search Bar*/}
            <SearchHeader />
                
                
            {/*Listings Label */}
            <Heading color={colors.secondary}
                  mt='$2'
                  ml='$5'
                  mb='$2' 
                  paddingTop='$5'
                  textAlign="left"
                  fontSize="$2xl"
                  fontWeight='bold'>Listings
            </Heading>
            
            {/*Listing Box Container*/}
            <HStack space = "xs" flexWrap='wrap'>
                <ItemCard />
            </HStack>



            {/*Dashboard */}
            <Box  top={810} position="absolute"  h="20%" width="100%" backgroundColor="$green" borderRadius={50} alignItems='center'>
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
            </Box>

        </Box>
    )
}