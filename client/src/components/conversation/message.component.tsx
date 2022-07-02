import React from 'react';
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
            marginLeft: '10px',
          }}
        >
          <Avatar
            src={
              userInfo?.profilePhotoFileString
                ? `data:image/jpeg;base64,${userInfo.profilePhotoFileString}`
                : ''
            }
            alt={userInfo?.name || ''}
            sx={{ height: '24px', width: '24px' }}
          />
        </Grid>
      )}
      <Grid
        sx={{
          display: 'flex',
          borderRadius: '20px',
          padding: '10px',
          alignItems: 'center',
          backgroundColor: 'rgb(239, 239, 239)',
          marginBottom: '8px',
        }}
      >
        <Typography sx={{ fontSize: 14 }}>{message.text}</Typography>
      </Grid>
    </Grid>
  );
};

export default MessageComponent;
