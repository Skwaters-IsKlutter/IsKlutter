import React, { useState } from 'react';
import { Input, InputField, Button, Text } from '@gluestack-ui/themed';
import colors from '../config/colors.js';

export default function CommentInput ({ user, addCommmunityComment }) {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    addCommmunityComment(user.key, commentText);
    setCommentText('');
  };

  return (
    <Input bg={colors.white} borderColor={colors.secondary} h={40} w="100%">
      <InputField
        multiline={true}
        size="md"
        value={commentText}
        placeholder="Comment."
        onChangeText={(text) => setCommentText(text)}
      />
      <Button
        variant="solid"
        size="sm"
        bg={colors.secondary}
        borderRadius={8}
        ml={3}
        onPress={handleAddComment}
      >
        <Text color={colors.white} fontSize="$sm">
          Comment
        </Text>
      </Button>
    </Input>
  );
}