import React, { useState } from 'react';
import { Grid, Avatar, Typography } from '@mui/material';
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
        width: '100%',
        height: 'auto',
        minHeight: '44px',
      }}
    >
      {!isCurrentUser && (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <Avatar
            src={
              userInfo
                ? `data:image/jpeg;base64,${userInfo.profilePhotoFileString}`
                : ''
            }
            alt={userInfo?.name || ''}
            sx={{ height: '24px', width: '24px' }}
          />
        </Grid>
      )}
      <Grid sx={{ display: 'flex', borderRadius: '50%' }}>
        <Typography sx={{ fontSize: 14 }}>{message.text}</Typography>
      </Grid>
    </Grid>
  );
};

export default MessageComponent;
