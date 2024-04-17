import React, { useState, useEffect } from 'react';
import { VStack, Heading, Button, ButtonText, Box, HStack } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { useNavigation} from '@react-navigation/native';

import Routes from '../components/constants/Routes.js';
import { Pressable } from 'react-native';

export default function BidItemCard({ listingPrice, listingName,remainingTime, toBidding, }) {
  const navigation = useNavigation();
  const [timeRemaining, setTimeRemaining] = useState(4 * 3600 + 30 * 60 + 10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  return (
    
      <Box p="$2">
      <VStack bg={colors.white} borderRadius={10}  width="100%" maxHeight={350}>
        <HStack width="100%">
          <Box bg={colors.black} borderRadius={10} height={180} width={150} />
          <VStack p="$3" flex={1}>
            <Heading fontSize="$xl" color={colors.primary}>{listingName}</Heading>
            <Heading fontSize="$md" color={colors.secondary} p={0}>PHP {listingPrice}</Heading>
            <Heading fontSize="$sm" color={colors.black}>Ends in: {remainingTime} days</Heading>
            <Button bgColor={colors.primary} p={5}  borderRadius={50} mt={10} width="70%" onPress={toBidding}>
              <ButtonText>Bid Now</ButtonText>
            </Button>
          </VStack>
        </HStack>
      </VStack>
      </Box>
  );
}
