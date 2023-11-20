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

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function CommunityPage() {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeader userIcon={require("../../assets/img/usericon.jpg")} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Community Label */}
                <VStack space="xs" pb="$0">
                    <Box bg={colors.secondary} borderTopRightRadius={20} borderTopLeftRadius={20}>
                        <Heading lineHeight={60} fontSize="$3xl" pl="$5" color={colors.white}>Community</Heading>
                    </Box>
                </VStack>

                {/*Community Posts Container */}
                <Box bg="$amber200" borderBottomLeftRadius={10} borderBottomRightRadius={10} p="$5" m={5} flex={1}>
                    <VStack space="xs">
                        <PostBox posterIcon={require("../../assets/img/usericon.jpg")} post={() => Alert.alert("Alert", "This is a dummy action")} />
                    </VStack>

                    <ScrollView>
                        <HStack space="xs" flexWrap="wrap" justifyContent="center">
                            <PostCard
                                // posterIcon={ require("../../assets/img/usericon.jpg") }
                                posterName="Sassa"
                                postDate="11/20/2023"
                                postContent="betlog"
                            />
                        </HStack>
                    </ScrollView>
                </Box>
            </Box>
        </Box>
    )
}