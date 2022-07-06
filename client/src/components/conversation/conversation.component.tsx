import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import MessageComponent from './message.component';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';
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

import { clearSuggestionPhotoFileArray } from '../../redux/post/post.actions';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Socket } from 'socket.io-client';
import { getConvoName } from '../../pages/messages-page/messages-page.utils';

interface ConversationProps {
  conversationId: string;
  avatarS3Keys: string[];
  socket: Socket;
}

type UserInfoMap = Record<string, UserInfoData>;

const Conversation: React.FC<ConversationProps> = ({
  conversationId,
  avatarS3Keys,
  socket,
}) => {
  const [message, setMessage] = useState('');
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({});
  const [textAreaParentDivHeight, setTextAreaParentDivHeight] = useState(80);
  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);
  const usersInfoList = useUserInfoData(conversationUsers);

  const currentConversation = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const conversationMessageUsers = currentConversation?.connectedUsers;
  const currentConversationMessages = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages?.messages;
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const messageJustSent = useRef(false);

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
    if (messageJustSent.current === true) {
      messageJustSent.current = false;
      return;
    }

    const { value } = e.target as HTMLInputElement;

    setMessage(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      messageJustSent.current = true;
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (trimmedMessage === '') {
      setMessage('');
      return;
    }

    if (currentUser) {
      socket.emit('chatToServer', {
        text: trimmedMessage,
        created: new Date(),
        ownerId: currentUser.id,
        conversationId,
      });
    }
    setMessage('');
  };

  const textAreaRef = (node: HTMLElement | null) => {
    if (node) {
      resizeObserver.current = new ResizeObserver((entries) => {
        setTextAreaParentDivHeight(entries[0].contentRect.height + 40);
      });

      resizeObserver.current.observe(node);
    }
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '800px',
      }}
    >
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
        <CustomAvatarGroup
          conversationName={currentConversation?.name || ''}
          avatarS3Keys={avatarS3Keys}
          styleVariation={StyleVariation.conversationHeader}
        />
        <Typography>
          {currentConversation
            ? getConvoName(currentConversation, currentUser)
            : ''}
        </Typography>
      </Grid>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '20px',
          height: `calc(100% - ${textAreaParentDivHeight + 60}px)`,
          minHeight: '600px',
          maxHeight: '660px',
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
      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxHeight: `${textAreaParentDivHeight}px`,
          padding: '20px 0px',
        }}
      >
        <Box component='form' sx={{ width: '100%' }}>
          <TextField
            multiline
            maxRows={4}
            minRows={1}
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
            ref={textAreaRef}
            InputProps={{
              endAdornment: !!message.length && (
                <InputAdornment
                  position='end'
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '45px',
                  }}
                >
                  <Button
                    variant='text'
                    size='small'
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
                padding: '10px 14px',
                borderRadius: '20px',
              },
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Conversation;
