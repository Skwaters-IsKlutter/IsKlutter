import * as React from 'react';
import {
    VStack,
    HStack,
    Text,
    Heading,
    Image,
    Box,
    Button,
    ButtonText,
    FormControl,
    Input,
    InputField,
    ScrollView
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import SearchHeader from '../components/SearchHeader.js';
import PostBox from '../components/PostBox.js';
import PostCard from '../components/PostCard.js';
import ImgCarousel from '../components/Carousel.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function CommunityPage() {
    const navigation = useNavigation();

    const communityData = [
        { 
            posterIcon: require("../../assets/img/sassa.jpg"),
            posterName: "Sassa",
            postDate: "11/20/2023",
            postContent: "avail na po ang neon balls"
        }, { 
            posterIcon: require("../../assets/img/usericon.jpg"),
            posterName: "Rawr",
            postDate: "11/19/2023",
            postContent: "Hello."
        }, {
            posterIcon: require("../../assets/img/sassa.jpg"),
            posterName: "Sassa",
            postDate: "11/17/2023",
            postContent: "sapaka niyo ko b"
        }
        
    ]

    const renderCommunityPosts = () => {
        return communityData.map((post, index) => 
            <PostCard
                key={index}
                posterIcon={post.posterIcon}
                posterName={post.posterName}
                postDate={post.postDate}
                postContent={post.postContent}
            />
        );
    }

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeader posterUser="Sassa Girl" userIcon={require("../../assets/img/usericon.jpg")} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Community Label */}
                <VStack space="xs" pb={2}>
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Community</Heading>
                    <ImgCarousel />
                    <PostBox posterIcon={require("../../assets/img/usericon.jpg")} post={() => Alert.alert("Alert", "This is a dummy action")} />
                </VStack>

                {/*Community Posts Container */}
                <Box bg={colors.medium} borderRadius={8} p="$5" m={5} flex={1}>
                    <ScrollView>
                        <HStack space="xs" flexWrap="wrap" justifyContent="center">
                            {renderCommunityPosts()}
                        </HStack>
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    )
}