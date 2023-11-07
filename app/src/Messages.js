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
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function MessagesPage( { user } ) {
    const navigation = useNavigation();

    // Message data
    const messages = [
        { text: 'Hi', user: 'other' },
        { text: 'Hello', user: 'me' },
        { text: 'Hi', user: 'other' },
        { text: 'Hello', user: 'me' },
        { text: 'Hi', user: 'other' },
        { text: 'Hello', user: 'me' },
        { text: 'Hi', user: 'other' },
        { text: 'Hello', user: 'me' },
        { text: 'Hi', user: 'other' },
        { text: 'Hello', user: 'me' },
    ];

    const renderMessageBubbles = () => {
        // Map messages
        return messages.map((message, index) => (
            <Box
                key={index}
                bg={message.user === 'me' ? colors.secondary : colors.primary}
                p="$3"
                m="$2"
                borderRadius={12}
                alignSelf={message.user === 'me' ? 'flex-end' : 'flex-start'}
                maxWidth="70%"
            >
                <Text color={message.user === 'me' ? colors.white : colors.white}>
                    {message.text}
                </Text>
            </Box>
        ));
    };

    return (
        <Box w="100%" h="100%" alignItems="center">
            <SearchHeader userIcon={require("../../assets/img/usericon.jpg")} />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label and post button */}
                <VStack space="xs" alignItems="center" bg={colors.secondary} borderTopStartRadius={8} borderTopEndRadius={8}>
                    <Heading lineHeight={40} fontSize="$2xl" fontWeight="$extrabold" color={colors.white}>cinnamonroll</Heading>
                </VStack>

                <ScrollView>
                    <Box bg={colors.white} p={10}>
                            {/* Render message bubbles based on data */}
                            <VStack space="xs" pb="$5" flex={1}>
                            {renderMessageBubbles()}
                        </VStack>
                    </Box>
                </ScrollView>

                <Box p={20}>
                    <HStack space="2xl" justifyContent="space-evenly">
                        <FormControl
                            borderRadius={10}
                            w="80%"
                            size="md"
                            isDisabled={false}
                            isInvalid={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <Input w="auto" bg={colors.white}>
                                <InputField type="text" defaultValue="" />
                            </Input>
                        </FormControl>

                        <Button
                            bg={colors.secondary}
                            borderRadius={8}
                            size="sm"
                            paddingHorizontal={25}
                            variant="solid"
                            action="primary"
                            isDisabled={false}
                            isFocusVisible={false}
                            onPress={() => Alert.alert("Alert", "This is a dummy action")}
                        >
                            <ButtonText>Send</ButtonText>
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
}