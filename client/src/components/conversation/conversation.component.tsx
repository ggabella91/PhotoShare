import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography } from '@mui/material';

import { selectConversationMessages } from '../../redux/message/message.selectors';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

interface ConversationProps {
  conversationId: string;
}

const Conversation: React.FC<ConversationProps> = ({ conversationId }) => {
  const conversationMessages = useSelector(selectConversationMessages);
  const currentConversationMessages = conversationMessages.filter(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages[0].messages;

  const dispatch = useDispatch();

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
