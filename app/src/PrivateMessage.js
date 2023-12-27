import * as React from 'react';
import {
    VStack,
    HStack,
    Text,
    Heading,
    Box,
    Button,
    ButtonText,
    FormControl,
    Input,
    InputField,
    ScrollView,
    Pressable
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SearchHeaderBack from '../components/SearchHeaderBack.js';
import UserAvatar from '../components/Avatar.js';
import SenderBox from '../components/SenderBox.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function PrivateMessagePage( { user } ) {

    const navigation = useNavigation();

    const privMessagesData = [
        { 
            senderIcon: require("../../assets/img/sassa.jpg"),
            senderName: "Sassa",
            senderUsername: "@sassagurl",
        }
    ]

    const renderSenderBox = () => {
        return privMessagesData.map((privMessage, index) =>
            <SenderBox
                key = {index}
                senderIcon={privMessage.senderIcon}
                senderName={privMessage.senderName}
                senderUsername={privMessage.senderUsername}
                // message={message.message}

            />
        );
    }

    return(
        // Parent box
        <Box w="100%" h="100%">

            {/*Search Bar*/}
            <SearchHeaderBack userIcon={ require("../../assets/img/usericon.jpg") } back={navigation.goBack} />

            {/* Messages Title */}
            <VStack space="xs" alignItems="left" bgColor="$amber200" p="$3" width="100%">
                <Heading lineHeight={40} fontSize="$3xl" fontWeight="$extrabold" 
                    color={colors.secondary} m={2} >Messages</Heading>
            </VStack>

         
            {/* Container */}
                <ScrollView>
                    <HStack space={0} flexWrap="wrap">
                                {renderSenderBox()}
                    </HStack>
                </ScrollView> 
           
        </Box>
    )

}