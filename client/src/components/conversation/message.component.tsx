import React from 'react';
import { Grid } from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';

interface MessageProps {
  userInfo: UserInfoData;
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ userInfo, message }) => {
  return <Grid></Grid>;
};

export default MessageComponent;
