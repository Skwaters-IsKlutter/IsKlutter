import * as React from 'react';
import {
    VStack,
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

import SearchHeaderBack from '../components/SearchHeaderBack.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function MessagesPage({ user }) {
    const navigation = useNavigation();

    const messages = [
    { id: 1, sender: 'John Doe', text: 'Hey, how are you?' },
    { id: 2, sender: 'Jane Smith', text: 'Can you send me the report?' },
    // Add more messages as needed
  ];

  // Function to handle message click
  const handleMessageClick = (id) => {
    // Redirect to chat box with the specific message ID
    navigation.navigate('ChatBox', { messageId: id });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {messages.map((message) => (
        <TouchableOpacity key={message.id} onPress={() => handleMessageClick(message.id)}>
          <View style={{ padding: 10, marginBottom: 10, backgroundColor: '#e0e0e0', borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{message.sender}</Text>
            <Text>{message.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

//     // Message data
//     const messages = [
//         { text: 'Hi', user: 'other' },
//         { text: 'Hello', user: 'me' },
//         { text: 'Hi', user: 'other' },
//         { text: 'Hello', user: 'me' },
//         { text: 'Hi', user: 'other' },
//         { text: 'Hello', user: 'me' },
//         { text: 'Hi', user: 'other' },
//         { text: 'Hello', user: 'me' },
//         { text: 'Hi', user: 'other' },
//         { text: 'This is an example of a very long message. I want to eat ice cream. I like rainbows. Hello, Sir Jayvee! Yay!', user: 'me' },
//     ];

//     const renderMessageBubbles = () => {
//         // Map messages
//         return messages.map((message, index) => (
//             <Box
//                 key={index}
//                 bg={message.user === 'me' ? colors.secondary : colors.primary}
//                 p="$3"
//                 m="$2"
//                 borderRadius={12}
//                 alignSelf={message.user === 'me' ? 'flex-end' : 'flex-start'}
//                 maxWidth="70%"
//             >
//                 <Text color={message.user === 'me' ? colors.white : colors.white}>
//                     {message.text}
//                 </Text>
//             </Box>
//         ));
//     };

//     return (
//         <Box w="100%" h="100%" alignItems="center">
//             <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} />

//             <Box p="$6" w="100%" maxWidth="$96" flex={1}>
//                 {/* Listings Label */}
//                 <VStack space="xs" alignItems="center" bg={colors.secondary} borderTopStartRadius={8} borderTopEndRadius={8}>
//                     <Heading lineHeight={40} fontSize="$2xl" fontWeight="$extrabold" color={colors.white}>cinnamonroll</Heading>
//                 </VStack>

//                 {/* Messages */}
//                 <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
//                     <Box bg={colors.white} p={10}>
//                         <VStack space="xs">
//                             {renderMessageBubbles()}
//                         </VStack>
//                     </Box>
//                 </ScrollView>

//                 {/* Input Field */}
//                 <Box p={20}>
//                     <FormControl
//                         borderRadius={10}
//                         w="100%"
//                         size="md"
//                         isDisabled={false}
//                         isInvalid={false}
//                         isReadOnly={false}
//                         isRequired={false}
//                     >
//                         <Input bg={colors.white}>
//                             <InputField type="text" defaultValue="" />
//                         </Input>
//                     </FormControl>

//                     <Button
//                         bg={colors.secondary}
//                         borderRadius={8}
//                         size="sm"
//                         paddingHorizontal={25}
//                         variant="solid"
//                         action="primary"
//                         isDisabled={false}
//                         isFocusVisible={false}
//                         onPress={() => Alert.alert("Alert", "This is a dummy action")}
//                     >
//                         <ButtonText>Send</ButtonText>
//                     </Button>
//                 </Box>
//             </Box>
//         </Box>
//     );
// }
