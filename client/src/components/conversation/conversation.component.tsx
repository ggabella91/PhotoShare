import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import MessageComponent from './message.component';
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
  clearConversationUsers,
} from '../../redux/user/user.actions';

import { selectConvoAvatarMap } from '../../redux/post/post.selectors';

import { clearSuggestionPhotoFileArray } from '../../redux/post/post.actions';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Socket } from 'socket.io-client';

interface ConversationProps {
  conversationId: string;
  avatarS3Key: string;
  socket: Socket;
}

type UserInfoMap = Record<string, UserInfoData>;

const Conversation: React.FC<ConversationProps> = ({
  conversationId,
  avatarS3Key,
  socket,
}) => {
  const [message, setMessage] = useState('');
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({});
  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileString =
    avatarS3Key && convoAvatarMap.get(avatarS3Key)?.fileString;
  const usersInfoList = useUserInfoData(conversationUsers);

  const currentConversation = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const conversationMessageUsers = currentConversation?.connectedUsers;
  const currentConversationMessages = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages?.messages;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearConversationUsers());
    dispatch(clearSuggestionPhotoFileArray());
  }, []);

  useEffect(() => {
    if (conversationMessageUsers?.length) {
      conversationMessageUsers.forEach((userId) =>
        dispatch(
          getOtherUserStart({
            type: OtherUserType.CONVERSATION_USER,
            usernameOrId: userId,
          })
        )
      );
    }
  }, [conversationMessageUsers]);

  useEffect(() => {
    if (usersInfoList?.size) {
      const userInfoMap = usersInfoList.reduce<UserInfoMap>((acc, cur) => {
        acc[cur.id!] = cur;
        return acc;
      }, {});

      setUserInfoMap(userInfoMap);
    }
  }, [usersInfoList]);

  const handleMessageChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;

    setMessage(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (currentUser) {
      socket.emit('chatToServer', {
        text: message,
        created: new Date(),
        ownerId: currentUser.id,
        conversationId,
      });
    }
    setMessage('');
  };

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Grid
        sx={{
          display: 'flex',
          height: '60px',
          minHeight: '60px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '0px 20px',
          borderBottom: '1px solid rgb(219,219,219)',
        }}
      >
        <Avatar
          src={
            !!convoAvatarFileString
              ? `data:image/jpeg;base64,${convoAvatarFileString}`
              : ''
          }
          sx={{
            marginLeft: '15px',
            marginRight: '15px',
            height: '24px',
            width: '24px',
          }}
        />
        <Typography>{currentConversation?.name || ''}</Typography>
      </Grid>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          minHeight: '80%',
          overflowY: 'auto',
        }}
      >
        {messagesArray?.map((message) => (
          <MessageComponent
            key={message.id}
            userInfo={userInfoMap[message.ownerId]}
            message={message}
            isCurrentUser={message.ownerId === currentUser?.id}
            isGroupConversation={
              !!(conversationUsers && conversationUsers.length > 2)
            }
          />
        ))}
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex' }}>
        <Box component='form' sx={{ width: '100%' }}>
          <TextField
            multiline
            maxRows={4}
            sx={{
              width: 'calc(100% - 40px)',
              margin: '15px 20px',
            }}
            label=''
            placeholder='Message...'
            fullWidth
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: !!message.length && (
                <InputAdornment position='end'>
                  <Button
                    variant='text'
                    onClick={handleSendMessage}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'unset',
                      },
                    }}
                  >
                    <Typography
                      sx={{ color: '#0095F6', textTransform: 'capitalize' }}
                    >
                      Send
                    </Typography>
                  </Button>
                </InputAdornment>
              ),
              style: {
                fontSize: '14px',
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Conversation;
