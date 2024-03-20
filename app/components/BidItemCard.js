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

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (

      <Box p="$2">
      <VStack bg={colors.white} borderRadius={10}  width="100%" maxHeight={350}>
        <HStack width="100%">
          <Box bg={colors.black} borderRadius={10} height={180} width={150} />
          <VStack p="$3" flex={1}>
            <Heading fontSize="$xl" color={colors.primary}>{listingName}</Heading>
            <Heading fontSize="$md" color={colors.secondary} p={0}>PHP {listingPrice}</Heading>
            <Heading fontSize="$md" color={colors.black}>Remaining Time: {formatTime(timeRemaining)}</Heading>
            <Button bgColor={colors.primary} p={5}  borderRadius={50} width="60%" onPress={toBidding}>
              <ButtonText>Bid Now</ButtonText>
            </Button>
          </VStack>
        </HStack>
      </VStack>
      </Box>
  );
}
