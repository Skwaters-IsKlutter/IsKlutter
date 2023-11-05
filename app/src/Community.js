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
    InputField
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function CommunityPage() {
    const navigation = useNavigation();

    return (

        // Parent box
        <Box w="100%" h="100%">
            <SearchHeader userIcon={ require("../../assets/img/usericon.jpg")} />
            {/* Logo */}
            {/* <VStack w="100%" h="$10" pb="$4" justifyContent="center" alignItems="center">
                <Image source={ require("../assets/img/icon.png") } h={100} w={100} alt="logo" />
            </VStack> */}

            {/* Form control for login */}
            <Box p="$6" w="100%" maxWidth="$96">
                {/* Heading */}
                <VStack space="xs" pb="$0">
                    <Box bg="$green900" borderTopRightRadius={20} borderTopLeftRadius={20}>
                        <Heading lineHeight={60} fontSize="$3xl" pl="$5" color="$white" >Community</Heading>
                    </Box>
                </VStack> 

                <Box bg="$amber200" borderBottomLeftRadius={10} borderBottomRightRadius={10} p="$5" pb="$20">
                    <HStack space="xs" pb="$5">
                        <Image
                            size="md"
                            borderRadius={100}
                            w={50}
                            h={50}
                            alt="icon"
                            source={{
                                uri: "https://pbs.twimg.com/media/F48fFS5a4AAwjKX.jpg",
                            }}
                        /> 
                            <FormControl
                                borderRadius={10}
                                w="60%"
                                size="md"
                                isDisabled={false}
                                isInvalid={false}
                                isReadOnly={false}
                                isRequired={false}
                            >
                            <Input w="100%" bg="$white">
                                <InputField type="text" defaultValue=""/>
                            </Input>
                            </FormControl>
                        
      
                        <Button bg="$green800" borderRadius={10} size="sm" variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                                <ButtonText> Post </ButtonText>
                            </Button>
                    </HStack>
                    <VStack space="xs" pb="$100">                   
                        <Box
                            bg="$white"
                            p="$3"
                            borderRadius={10}
                        >
                            <HStack pb="$3">
                                <Image
                                    size="md"
                                    borderRadius={100}
                                    w={30}
                                    h={30}
                                    alt="icon"
                                    source={{
                                        uri: "https://i.pinimg.com/736x/1b/de/dc/1bdedc3493e6b05745ffc63a42c952c5.jpg",
                                    }}
                                />   
                                <Text color="black" size="sm" bold={true}> @deadasf </Text>
                                <Text color="gray" size="2xs" pl={100}> 2023-10-17 </Text>
                            </HStack>

                            <Text color="black" pb="$3" size="sm">
                                GOJO WILL COME BACK! HE WILL WIN!
                                GOJO WILL COME BACK! HE WILL WIN!
                                GOJO WILL COME BACK! HE WILL WIN!
                            </Text>

                            <HStack>
                            <FormControl
                                borderRadius={10}
                                bg='$white'
                                borderColor='none'
                                w="65%"
                            >
                                <Input>
                                    <InputField placeholder="Write a comment..." />
                                </Input>
                            </FormControl>
                            <Button bg="$red700" borderRadius={50} size="xs" variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                                <ButtonText> Comment </ButtonText>
                            </Button>
                            </HStack>
                        </Box>  
                    </VStack>
                </Box>
            </Box>
        </Box>
    )
}