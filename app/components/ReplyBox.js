import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, HStack, Image, Input } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { getFirestore, doc, getDocs, collection, where, query } from 'firebase/firestore';

export default function ReplyBox({ replyID, replyText, replyUser, replyDate, replyTime, userIcon }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
        const firestore = getFirestore();
        const usersCollectionRef = collection(firestore, 'users');
        const userQuery = query(usersCollectionRef, where('userID', '==', replyUser));
      
        try {
          const userQuerySnapshot = await getDocs(userQuery);
      
          if (!userQuerySnapshot.empty) {
            const userData = userQuerySnapshot.docs[0].data();
            setUserData(userData);
          } else {
            console.log('User not found for ID:', replyUser);
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        } finally {
          setLoading(false); // Set loading to false whether successful or not
        }
      };
      

    fetchUsername();
  }, [replyUser]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p="$2" h="auto" bg={colors.white} flex={1}>
      <VStack space="sm" m={6}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text color={colors.gray} fontSize="$lg" fontWeight="$extrabold">{userData.username}</Text>
          <HStack space="sm">
            <Text color={colors.gray} fontSize="$xs">{replyDate}</Text>
            <Text color={colors.gray} fontSize="$xs">{replyTime}</Text>
          </HStack>
        </HStack>
      </VStack>

      <HStack space="sm" justifyContent="center" alignItems="center">
        <Image source={{ uri: userData.userProfileImg }} h={45} w={45} alt="icon" borderRadius={100} />
        <Box h="$10" w="75%">
          <Input bg={colors.white} p={10}>
            <Text>{replyText}</Text>
          </Input>
        </Box>
      </HStack>
    </Box>
  );
}
