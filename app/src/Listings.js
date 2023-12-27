// ListingsPage.js

import React from 'react';
import { VStack, Heading, Box, ScrollView } from '@gluestack-ui/themed';
import { useRoute } from '@react-navigation/native';

import SearchHeader from '../components/SearchHeader.js';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import CommentBox from '../components/CommentBox.js';
import ReplyBox from '../components/ReplyBox.js';

import colors from '../config/colors.js';

const ListingsPage = () => {
  const route = useRoute();
  const { item } = route.params;

  const renderListings = () => {
    console.log('Item:', item);
    if (item) {
      return (
        <ListingCard
          key={item.id}
          productImage={item.listingImageURL || require('../../assets/img/item.jpg')}
          productName={item.listingName}
          productPrice={item.listingPrice}
          productDesc={item.listingDescription}
          sellerName={item.username}
          tags={item.listingTags}
        />
      );
    }
    return null;
  };

  const listingsRepliesData = [
    {
      replyUser: 'kuromi',
      userIcon: require('../../assets/img/usericon.jpg'),
      replyText: 'mine!',
      replyDate: '10/25/2023',
      replyTime: '12:58 PM',
    },
    {
      replyUser: 'sassag0rl',
      userIcon: require('../../assets/img/sassa.jpg'),
      replyText: 'EPAL NG NAG MINE',
      replyDate: '10/25/2023',
      replyTime: '1:43 PM',
    },
  ];

  const renderListingsReply = () => {
    return listingsRepliesData.map((listing, index) => (
      <ReplyBox
        key={index}
        replyUser={listing.replyUser}
        userIcon={listing.userIcon}
        replyText={listing.replyText}
        replyDate={listing.replyDate}
        replyTime={listing.replyTime}
      />
    ));
  };

  return (
    // Parent box
    <Box w="100%" h="100%">
      {/*Search Bar*/}
      <SearchHeaderBack
        userIcon={require('../../assets/img/usericon.jpg')}
        back={() => {
          // Handle navigation back here
        }}
      />

      <Box p="$6" w="100%" maxWidth="$96" flex={1}>
        {/*Listings Label */}
        <VStack space="xs" pb="$2">
          <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>
            Listings
          </Heading>
        </VStack>

        <ScrollView>
          <VStack space="xs" flexWrap="wrap">
            {renderListings()}
          </VStack>

          {/* Added a comment */}
          <VStack space="xs">
            <CommentBox
              posterIcon={require('../../assets/img/usericon.jpg')}
              comment={() =>
                Alert.alert('Alert', 'This is a dummy action')
              }
            />
          </VStack>

          {/* Replies */}
          <VStack space="xs">
            <Heading pt="$3" fontSize="$2xl" color={colors.secondary}>
              Replies
            </Heading>
            <VStack space="xs">{renderListingsReply()}</VStack>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default ListingsPage;
