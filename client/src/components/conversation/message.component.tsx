import React from 'react';
import { Grid, Avatar, Typography } from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';

type CustomRef = (node: HTMLDivElement | null) => void;

interface MessageComponentProps {
  id: string;
  userInfo: UserInfoData;
  message: Message;
  isCurrentUser: boolean;
  isGroupConversation: boolean;
  islastMessageFromDiffUser: boolean;
  userNickname?: string;
  renderedWithTimeStamp: boolean;
  custRef: CustomRef | null;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  id,
  userInfo,
  message,
  isCurrentUser,
  isGroupConversation,
  islastMessageFromDiffUser,
  userNickname,
  renderedWithTimeStamp,
  custRef,
}) => {
  const addMarginTop = isCurrentUser && renderedWithTimeStamp;
  const renderWithNameOrNickname =
    isGroupConversation && !isCurrentUser && islastMessageFromDiffUser;

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
      }}
      id={id}
    >
      {renderWithNameOrNickname && (
        <Grid
          sx={{
            display: 'flex',
            margin: '25px 0px 2px 48px',
            marginTop: renderedWithTimeStamp ? '15px !important' : '25px',
          }}
        >
          <Typography sx={{ fontSize: '10px' }}>
            {userNickname ? userNickname : userInfo?.name}
          </Typography>
        </Grid>
      )}
      <Grid
        sx={{
          display: 'flex',
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          width: '100%',
          height: 'auto',
          minHeight: '44px',
          marginTop:
            !isGroupConversation && renderedWithTimeStamp ? '15px' : '0px',
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
            marginTop: addMarginTop ? '15px' : '0px',
          }}
        >
          <Typography sx={{ fontSize: 14 }}>{message.text}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MessageComponent;
