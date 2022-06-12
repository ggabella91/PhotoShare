import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';

interface MessageComponentProps {
  userInfo: UserInfoData;
  message: Message;
  isCurrentUser: boolean;
  isGroupConversation: boolean;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  userInfo,
  message,
  isCurrentUser,
  isGroupConversation,
}) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Grid sx={{ display: 'flex', borderRadius: '50%' }}></Grid>
    </Grid>
  );
};

export default MessageComponent;
