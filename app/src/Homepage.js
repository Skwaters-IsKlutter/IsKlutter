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
    FormControlLabel, 
    FormControlError, 
    FormControlErrorText, 
    FormControlLabelText, 
    FormControlHelper, 
    FormControlHelperText, 
    FormControlErrorIcon, 
    Input, 
    InputField,
    Text
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import colors from '../config/colors.js'

export default function HomepagePage() {
    const navigation = useNavigation();

    return (
        // Parent box
        <Box w="100%" h="100%"  backgroundColor='lightgray'>
        
            {/*Search Bar*/}
            <Box w="100%" h="18%" backgroundColor='maroon' mb={'$0'} pb={'$10'} >
                <VStack>
                    <HStack p="$5" w="100%" mt={50}>
                        <FormControl
                                size="md"
                                isDisabled={false}
                                isInvalid={false}
                                isReadOnly={false}
                                isRequired={false}
                            >
                                <Input w={250}  backgroundColor='white'>
                                    <InputField type="username" defaultValue="" placeholder="Search" />
                                </Input>
                
                            </FormControl>
                            <Button variant="solid" ml={10} size="sm" backgroundColor="green" w="25%">
                                <ButtonText sx={{
                                    color: "$white"
                                }}>Search</ButtonText>
                            </Button>
                    </HStack>
                    <HStack space = "xs" flexWrap='wrap' ml={10} mt={-10}>
                        <Button variant="solid" ml={10} size="xs" backgroundColor="green" w="15%" borderRadius={100}>
                            <ButtonText sx={{
                                color: "$white"
                            }}>Tags</ButtonText>
                        </Button>    
                    </HStack>

                </VStack>
                
                
            </Box>
            {/*Listings Label */}
            <Text color="darkgreen" 
                  mt='$2'
                  ml='$5'
                  mb='$2' 
                  paddingTop='$5'
                  textAlign="left"
                  fontSize="$md"
                  fontWeight='bold'>Listings
            </Text>
            
            {/*Listing Box Container*/}
            <HStack space = "xs" flexWrap='wrap'>
       
                <Box backgroundColor="white" borderRadius={10} width="45%" h={230} m="2%" marginTop={0}>
                    <VStack padding={5} flex={1} top={5}>
                        <Image source={ require("../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                        <Heading fontSize="$2xl" ml={10} color='darkgreen'>Price</Heading>
                        <Text fontSize="$md" marginTop="-5px" ml={10}>Product Name</Text>
                    </VStack>
                    {/*Seller Part */}
                    <HStack space = "xs" p="$2">
                        <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/>
                        <Text>Seller</Text>
                        <Button variant="solid" size="sm" backgroundColor="maroon" borderRadius={100}>
                            <ButtonText sx={{
                                color: "$white"
                            }}>Chat</ButtonText>
                        </Button>
                    </HStack>  
                </Box>

                <Box backgroundColor="white" borderRadius={10} width="45%" h={230} m="2%" marginTop={0}>
                    <VStack padding={5} flex={1} top={5}>
                        <Image source={ require("../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                        <Heading fontSize="$2xl" ml={10} color='darkgreen'>Price</Heading>
                        <Text fontSize="$md" marginTop="-5px" ml={10}>Product Name</Text>
                    </VStack>
                    {/*Seller Part */}
                    <HStack space = "xs" p="$2">
                        <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/>
                        <Text>Seller</Text>
                        <Button variant="solid" size="sm" backgroundColor="maroon" borderRadius={100}>
                            <ButtonText sx={{
                                color: "$white"
                            }}>Chat</ButtonText>
                        </Button>
                    </HStack>  
                </Box>

                <Box backgroundColor="white" borderRadius={10} width="45%" h={230} m="2%" marginTop={0}>
                    <VStack padding={5} flex={1} top={5}>
                        <Image source={ require("../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                        <Heading fontSize="$2xl" ml={10} color='darkgreen'>Price</Heading>
                        <Text fontSize="$md" marginTop="-5px" ml={10}>Product Name</Text>
                    </VStack>
                    {/*Seller Part */}
                    <HStack space = "xs" p="$2">
                        <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/>
                        <Text>Seller</Text>
                        <Button variant="solid" size="sm" backgroundColor="maroon" borderRadius={100}>
                            <ButtonText sx={{
                                color: "$white"
                            }}>Chat</ButtonText>
                        </Button>
                    </HStack>  
                </Box>

                <Box backgroundColor="white" borderRadius={10} width="45%" h={230} m="2%" marginTop={0}>
                    <VStack padding={5} flex={1} top={5}>
                        <Image source={ require("../assets/img/usericon.jpg") } h={100} w="auto" alt="icon" backgroundColor='gray' borderTopLeftRadius={5} borderTopRightRadius={5}/>
                        <Heading fontSize="$2xl" ml={10} color='darkgreen'>Price</Heading>
                        <Text fontSize="$md" marginTop="-5px" ml={10}>Product Name</Text>
                    </VStack>
                    {/*Seller Part */}
                    <HStack space = "xs" p="$2">
                        <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} backgroundColor='gray'/>
                        <Text>Seller</Text>
                        <Button variant="solid" size="sm" backgroundColor="maroon" borderRadius={100}>
                            <ButtonText sx={{
                                color: "$white"
                            }}>Chat</ButtonText>
                        </Button>
                    </HStack>  
                </Box>
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