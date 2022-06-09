import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import { useUserInfoData } from '../../pages/hooks';

import {
  selectJoinedConversations,
  selectConversationMessages,
} from '../../redux/message/message.selectors';

import {
  selectCurrentUser,
  selectConversationUsers,
} from '../../redux/user/user.selectors';
import { OtherUserType } from '../../redux/user/user.types';
import {
  getOtherUserStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import { clearSuggestionPhotoFileArray } from '../../redux/post/post.actions';

interface ConversationProps {
  conversationId: string;
}

const Conversation: React.FC<ConversationProps> = ({ conversationId }) => {
  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);

  const usersInfoList = useUserInfoData(conversationUsers);

  const currentConveration = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const conversationMessageUsers = currentConveration?.connectedUsers;
  const currentConversationMessages = conversationMessages.filter(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages[0].messages;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserSuggestions());
    dispatch(clearSuggestionPhotoFileArray());
  }, []);

  useEffect(() => {
    if (conversationMessageUsers?.length) {
      conversationMessageUsers.forEach((user) =>
        dispatch(
          getOtherUserStart({
            type: OtherUserType.CONVERSATION_USER,
            usernameOrId: user.userId,
          })
        )
      );
    }
  }, [conversationMessageUsers]);

  return (
    <Grid>
      {messagesArray.map((message) => (
        <Grid>
          <Typography>{message.text}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default Conversation;
