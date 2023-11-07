import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonText,
    ScrollView
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import SearchHeader from '../components/SearchHeader.js';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';

import ProfileScreen from '../components/screens/ProfileScreen.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';


export default function ListingsPage({ productName, productImage, productPrice, productDesc, seller }) {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%">
            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg")}/>

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                <ScrollView>
                    <VStack space="xs" flexWrap="wrap">
                        <ListingCard 
                            productImage={ require("../../assets/img/item.jpg") }
                            productName="Kuromi Plush"
                            productPrice="PHP 300"
                            productDesc="This is a Kuromi plushie."
                            sellerName="cinnamonroll"
                            tags={[<TagLabel tagName="toys" />, <TagLabel tagName="new" />]}
                            sellerImage={ require("../../assets/img/usericon.jpg") }
                            sellerChat={() => Alert.alert("Alert", "This is a dummy action")}
                        />
                    </VStack>

                    {/* Added a comment */}
                    <VStack space="xs">
                        <CommentBox posterIcon={ require("../../assets/img/usericon.jpg") } comment={() => Alert.alert("Alert", "This is a dummy action")} />
                    </VStack>
                    
                    {/* Replies */}
                    <VStack space="xs">
                        <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>Replies</Heading>
                        <VStack space="xs">
                            <ReplyBox userIcon={ require("../../assets/img/usericon.jpg") } replyUser="kuromi" replyText="mine!" replyDate="10/25/2023" replyTime="12:58 PM"/>
                        </VStack>
                    </VStack>
                </ScrollView>
            </Box>
        </Box>
    );
}