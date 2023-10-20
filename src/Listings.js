import * as React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Image,
    Button,
    ButtonText
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

import colors from '../app/config/colors.js';
import Routes from '../app/components/Routes.js';

export default function ListingsPage() {
    return (
        // Parent box
        <Box w="100%" h="100%" justifyContent="center" alignItems="center">
            <Box p="$6" w="100%" maxWidth="$96">

                {/* Heading */}
                <VStack space="xs" pb="$2">
                    <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                </VStack>

                {/* Listing box */}
                <Box p="$3" w="100%" backgroundColor="$white">
                    <VStack space="md" pb="$2">
                        <Image source={ require("../assets/img/item.jpg") } h={230} w="100%" alt="item" borderRadius={3}/>
                    </VStack>

                    {/* Item name and price */}
                    <VStack space="sm" p="$2">
                        <Heading fontSize="$2xl" color={colors.primary}>Kuromi Plush</Heading>
                        <Text fontSize="$lg" color={colors.secondary}>PHP 200</Text>
                    </VStack>

                    {/* Description */}
                    <VStack space="sm" p="$2">
                        <Text fontSize="md">bilhin niyo na pls, bigay ng ex ko</Text>
                    </VStack>

                    {/* Poster info */}
                    <HStack space="sm" p="$2">
                        <Image source={ require("../assets/img/usericon.jpg") } h={50} w={50} alt="icon" borderRadius={100} />
                        <Text lineHeight={50}>cinnamonroll</Text>
                    </HStack>

                    <VStack space="sm" p="$2">
                        <Button variant="solid" size="sm" backgroundColor={colors.primary} borderRadius={12}>
                            <ButtonText color={colors.white} fontSize="$sm">Chat</ButtonText>
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}