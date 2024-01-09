import React from 'react';
import { Box, Text } from '@gluestack-ui/themed';
import colors from '../config/colors.js';

export default function CommentList ({ comments }) {
  return (
    <Box>
      {comments.map((comment, index) => (
        <Text key={index} color={colors.black} fontSize="$md">
          {comments.username}: {comments.comment}
        </Text>
      ))}
    </Box>
  );
};

