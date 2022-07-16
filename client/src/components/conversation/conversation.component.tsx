import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoIcon from '@mui/icons-material/Info';
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
  setShowConvoDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExistingConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

type UserInfoMap = Record<string, UserInfoData>;

const Conversation: React.FC<ConversationProps> = ({
  conversationId,
  avatarS3Keys,
  socket,
  setShowConvoDialog,
  setIsExistingConvo,
}) => {
  const [message, setMessage] = useState('');
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({});
  const [textAreaParentDivHeight, setTextAreaParentDivHeight] = useState(80);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [convoName, setConvoName] = useState('');
  const [showConvoNameDone, setShowConvoNameDone] = useState(false);
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

  useEffect(() => {
    if (currentConversation && currentConversation.name !== 'default')
      setConvoName(currentConversation.name);
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation && convoName) {
      setShowConvoNameDone(
        !!(convoName?.length && convoName !== currentConversation?.name)
      );
    }
  }, [currentConversation, convoName]);

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

  const handleChangeConvoName = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setConvoName(value);
  };

  const handleSubmitNewConvoName = () => {
    socket.emit('updateConversation', {
      id: conversationId,
      name: convoName,
    });
    setShowConvoNameDone(false);
  };

  const handleSubmitNewConvoNameEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitNewConvoName();
    }
  };

  const handleClickInfoIcon = () => setIsInfoClicked(!isInfoClicked);

  const handleShowAddPeopleModal = () => {
    setShowConvoDialog(true);
    setIsExistingConvo(true);
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
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px 20px',
          borderBottom: '1px solid rgb(219,219,219)',
        }}
      >
        {!isInfoClicked ? (
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
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
        ) : (
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              paddingLeft: '20px',
            }}
          >
            <Typography>Details</Typography>
          </Grid>
        )}
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!isInfoClicked ? (
            <InfoOutlinedIcon
              sx={{ cursor: 'pointer' }}
              onClick={handleClickInfoIcon}
            />
          ) : (
            <InfoIcon
              sx={{ cursor: 'pointer' }}
              onClick={handleClickInfoIcon}
            />
          )}
        </Grid>
      </Grid>
      {!isInfoClicked ? (
        <>
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
        </>
      ) : (
        <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid sx={{ display: 'flex', padding: '10px' }}>
            <Typography sx={{ marginRight: '10px' }}>
              Conversation Name:{' '}
            </Typography>
            <TextField
              sx={{
                input: {
                  border: 'none',
                  padding: '2px 0px',
                },
                width: '60%',
              }}
              label=''
              placeholder='Add a name'
              fullWidth
              value={convoName}
              onChange={handleChangeConvoName}
              onKeyDown={handleSubmitNewConvoNameEnterKey}
              InputProps={{
                endAdornment: showConvoNameDone && (
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
                      onClick={handleSubmitNewConvoName}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'unset',
                        },
                      }}
                    >
                      <Typography
                        sx={{ color: '#0095F6', textTransform: 'capitalize' }}
                      >
                        Done
                      </Typography>
                    </Button>
                  </InputAdornment>
                ),
                style: {
                  fontSize: '14px',
                  padding: '0px 14px',
                  borderRadius: '20px',
                },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                },
              }}
            />
          </Grid>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid rgb(219,219,219)',
              borderBottom: '1px solid rgb(219,219,219)',
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                margin: '8px 0px',
                padding: '0px 16px',
              }}
            >
              <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 600 }}>Members</Typography>
                <Button
                  variant='text'
                  size='small'
                  onClick={handleShowAddPeopleModal}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'unset',
                    },
                  }}
                >
                  <Typography
                    sx={{ color: '#0095F6', textTransform: 'capitalize' }}
                  >
                    Add People
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            {conversationMessageUsers?.map((user) => {
              const userInfo = userInfoMap[user];

              return (
                <Grid
                  sx={{ display: 'flex', height: '72px', padding: '8px 16px' }}
                  key={userInfo.id}
                >
                  <Avatar
                    src={
                      userInfo?.profilePhotoFileString
                        ? `data:image/jpeg;base64,${userInfo.profilePhotoFileString}`
                        : ''
                    }
                    alt={userInfo?.name || ''}
                    sx={{ height: '56px', width: '56px' }}
                  />
                  <Grid
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {userInfo.username}
                    </Typography>
                    <Typography>{userInfo.name}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Conversation;
