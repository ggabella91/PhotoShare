import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';

import { selectConversationMessages } from '../../redux/message/message.selectors';

interface ConversationProps {
  conversationId: string;
}

const Conversation: React.FC<ConversationProps> = ({ conversationId }) => {
  const conversationMessages = useSelector(selectConversationMessages);
  const currentConversationMessages = conversationMessages.filter(
    (convoMessage) => convoMessage.conversationId === conversationId
  );

  return <Grid></Grid>;
};

export default Conversation;
