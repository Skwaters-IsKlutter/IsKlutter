// React
import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Gluestack UI
import { HStack, VStack, Heading, Box, ScrollView,Input,InputField,InputSlot,InputIcon, Button, ButtonIcon, ButtonText,Pressable } from '@gluestack-ui/themed';


// Local Components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeader from '../components/SearchHeader.js';
import BiddingCard from '../components/BidItemCard.js';
import Routes from '../components/constants/Routes.js';
import colors from '../config/colors.js';
import UserAvatar from '../components/Avatar.js';

// Firebase Components
import { collection, getDocs, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/firebase.js';
import BidItemCard from '../components/BidItemCard.js';

export default function AllBiddingsPage() {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');

  return (
    
    // Parent box
    <Box w="100%" h="100%" >
        {/* Header */}
        <Box backgroundColor={colors.primary} >
                <HStack p="$2" w="100%" mt={45} alignItems="center" >
                    <Pressable onPress={navigation.goBack}>
                        <MaterialCommunityIcons name="arrow-left-bold" color={colors.white} size={30} p={5} />
                    </Pressable>
                    <Heading lineHeight={50} fontSize={30} color={colors.white} ml={25} mr={150} >
                        Biddings
                    </Heading>
                    <Pressable onPress={() => navigation.navigate(Routes.PROFILE)}>
                      <UserAvatar/>
                    </Pressable>
                </HStack>  

            {/*Search Bar */}
            <VStack>  
            <HStack p="$3" w="100%"  justifyContent="space-evenly" >
              <Input w="90%" bg={colors.white}size="sm" borderRadius={20} left={-5} h={40}>
                <InputField
                  placeholder="Search"
                  // value={search}
                  // onChangeText={onSearchChange} // Add this line to handle text changes
                />
                <InputSlot>
                  <InputIcon>
                    <MaterialCommunityIcons name="magnify" color={colors.primary} size={15} right={15} />
                  </InputIcon>
                </InputSlot>
              </Input>
    
              {/* <Pressable onPress={() => navigation.navigate(Routes.MESSAGES)} pl={10}>
                <MaterialCommunityIcons name="message" color={colors.white} size={25} />
              </Pressable> */}
     
            </HStack>
          </VStack>
        </Box>

        {/* Add Bid Item Button */}
        <Button
              borderRadius={50}
              backgroundColor={colors.secondary}
              onPress={() => navigation.navigate(Routes.ADDLISTING)}
              p={5}
              m={10}
            >
              <ButtonIcon>
                <MaterialCommunityIcons name="plus-thick" size={20} color={colors.white}   />
              </ButtonIcon>
              <ButtonText pl={10}>Add item for bidding</ButtonText>
            </Button>

        {/* Bidding Container */}
        <Box>
          <ScrollView>
            <BidItemCard></BidItemCard>
            <BidItemCard></BidItemCard>
            <BidItemCard></BidItemCard>
            <BidItemCard></BidItemCard>
            <BidItemCard></BidItemCard>
            <BidItemCard></BidItemCard>
          </ScrollView>
        </Box>

          
    </Box>
  );
}
