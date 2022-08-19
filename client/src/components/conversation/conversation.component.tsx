import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  WheelEvent,
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageComponent from './message.component';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';
import ConversationUserOptionsDialog from './conversation-user-options-dialog.component';
import SetConvoUserNicknameDialog from './set-convo-user-nickname-dialog.component';
import { useUserInfoData } from '../../pages/hooks';

import {
  selectJoinedConversations,
  selectConversationMessages,
  selectIsLoadingMessages,
  selectConversationToUserDataMap,
} from '../../redux/message/message.selectors';
import {
  getConvoMessagesStart,
  addToConversationToUserDataMap,
} from '../../redux/message/message.actions';

import {
  selectCurrentUser,
  selectConversationUsers,
} from '../../redux/user/user.selectors';
import { OtherUserType } from '../../redux/user/user.types';
import {
  getOtherUserStart,
  clearConversationUsers,
} from '../../redux/user/user.actions';

import {
  clearSuggestionPhotoFileArray,
  uploadConversationPhotoStart,
} from '../../redux/post/post.actions';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Socket } from 'socket.io-client';
import { getConvoName } from '../../pages/messages-page/messages-page.utils';
import { shouldRenderTimeStamp, renderTimeStamp } from './conversation.utils';
import { useLazyLoading } from '../../pages/hooks';

interface ConversationProps {
  conversationId: string;
  avatarS3Keys: string[];
  socket: Socket;
  isInfoClicked: boolean;
  setIsInfoClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConvoDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExistingConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

export type UserInfoMap = Record<string, UserInfoData>;

export interface OptionsDialogUser {
  userId: string;
  isAdmin: boolean;
  nickname: string;
}

const Conversation: React.FC<ConversationProps> = ({
  conversationId,
  avatarS3Keys,
  socket,
  isInfoClicked,
  setIsInfoClicked,
  setShowConvoDialog,
  setIsExistingConvo,
}) => {
  const [message, setMessage] = useState('');
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({});
  const [textAreaParentDivHeight, setTextAreaParentDivHeight] = useState(80);
  const [convoName, setConvoName] = useState('');
  const [convoUserNicknameMap, setConvoUserNicknameMap] = useState<
    Record<string, string>
  >({});
  const [showConvoNameDone, setShowConvoNameDone] = useState(false);
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [optionsDialogUser, setOptionsDialogUser] = useState<OptionsDialogUser>(
    {
      userId: '',
      isAdmin: false,
      nickname: '',
    }
  );
  const [showNicknameChangeDialog, setShowNicknameChangeDialog] =
    useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);
  const conversationToUserDataMap = useSelector(
    selectConversationToUserDataMap
  );
  const isLoadingMessages = useSelector(selectIsLoadingMessages);
  const currentConversation = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const conversationHistoricalMessageUsers =
    currentConversation?.historicalUsers;

  const usersInfoList = useUserInfoData(conversationUsers);
  const { intersectionCounter, observedElementRef } = useLazyLoading(
    isLoadingMessages,
    true,
    1000
  );

  const conversationActiveMessageUsers = currentConversation?.connectedUsers;
  const conversationAdminUsers = currentConversation?.adminUsers;
  const conversationUserNicknames = currentConversation?.userNicknames;
  const currentConversationMessages = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const currentConversationAvatarPhotos = currentConversation?.avatarS3Keys;
  const messagesArray = currentConversationMessages?.messages;
  const totalMessagesForConvo = currentConversationMessages?.queryLength;
  const messagesArrayReversed = messagesArray && [...messagesArray].reverse();
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const messageJustSent = useRef(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const scrolledToBottomRef = useRef(false);
  const scrollingInMessagesContainerRef = useRef(false);
  const pageToFetch = useRef<Record<string, number>>({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!(conversationId in pageToFetch.current)) {
      pageToFetch.current[conversationId] = 1;
    }

    const shouldFetchMoreMessages = () =>
      messagesArray &&
      totalMessagesForConvo &&
      intersectionCounter !== pageToFetch.current[conversationId] &&
      messagesArray.length < totalMessagesForConvo &&
      pageToFetch.current[conversationId] + 1 <=
        Math.ceil(totalMessagesForConvo / 10);

    if (shouldFetchMoreMessages()) {
      dispatch(
        getConvoMessagesStart({
          conversationId,
          limit: 10,
          pageToShow: ++pageToFetch.current[conversationId],
        })
      );
    }
  }, [
    dispatch,
    conversationId,
    intersectionCounter,
    messagesArray,
    totalMessagesForConvo,
  ]);

  useEffect(() => {
    if (
      !conversationToUserDataMap?.has(conversationId) &&
      conversationHistoricalMessageUsers?.length
    ) {
      conversationHistoricalMessageUsers.forEach((userId) =>
        dispatch(
          getOtherUserStart({
            type: OtherUserType.CONVERSATION_USER,
            usernameOrId: userId,
          })
        )
      );
    }
  }, [
    dispatch,
    conversationHistoricalMessageUsers,
    conversationToUserDataMap,
    conversationId,
  ]);

  useEffect(() => {
    const cachedUserData = conversationToUserDataMap?.get(conversationId);

    if (cachedUserData) {
      setUserInfoMap(cachedUserData);
    } else if (usersInfoList?.size) {
      const userInfoMap = usersInfoList.reduce<UserInfoMap>((acc, cur) => {
        acc[cur.id!] = cur;
        return acc;
      }, {});

      setUserInfoMap(userInfoMap);
    }
  }, [usersInfoList, conversationToUserDataMap, conversationId]);

  useEffect(() => {
    const userInfoMapKeys = Object.keys(userInfoMap);

    if (
      !conversationToUserDataMap?.get(conversationId) &&
      conversationHistoricalMessageUsers &&
      conversationHistoricalMessageUsers.every((key) =>
        userInfoMapKeys.includes(key)
      )
    ) {
      dispatch(
        addToConversationToUserDataMap({
          conversationId,
          userData: userInfoMap,
        })
      );
    }
  }, [
    dispatch,
    conversationId,
    userInfoMap,
    conversationHistoricalMessageUsers,
    conversationToUserDataMap,
  ]);

  useEffect(() => {
    if (currentConversation && currentConversation.name !== 'default') {
      setConvoName(currentConversation.name);
    } else if (currentConversation) {
      setConvoName('');
    }
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation && convoName) {
      setShowConvoNameDone(
        !!(convoName?.length && convoName !== currentConversation?.name)
      );
    } else if (currentConversation) {
      setShowConvoNameDone(false);
    }
  }, [currentConversation, convoName]);

  useEffect(() => {
    if (conversationUserNicknames) {
      const convoUserNicknameMap = conversationUserNicknames.reduce<
        Record<string, string>
      >((acc, cur) => {
        acc[cur.userId] = cur.nickname;
        return acc;
      }, {});

      setConvoUserNicknameMap(convoUserNicknameMap);
    }
  }, [conversationUserNicknames]);

  useEffect(() => {
    socket.on('convoUserNicknameUpdated', () => {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });

      setShowNicknameChangeDialog(false);
      setOpenOptionsDialog(false);
    });
  }, [socket, currentUser]);

  useEffect(() => {
    setIsInfoClicked(false);
  }, [conversationId, setIsInfoClicked]);

  const messagesEndRef = (node: HTMLDivElement) => {
    messagesRef.current = node;

    if (!scrolledToBottomRef.current) {
      messagesRef.current?.scrollIntoView();
      scrolledToBottomRef.current = true;
    }
  };

  useEffect(() => {
    if (!scrollingInMessagesContainerRef.current) {
      messagesRef.current?.scrollIntoView();
    }
  }, [messagesArray]);

  useEffect(() => {
    if (!isInfoClicked) {
      messagesRef.current?.scrollIntoView();
    }
  }, [isInfoClicked]);

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

  const handleMessagesContainerScroll = (e: WheelEvent<HTMLDivElement>) => {
    scrollingInMessagesContainerRef.current = true;
    setTimeout(() => (scrollingInMessagesContainerRef.current = false), 500);
  };

  const handleChangeConvoName = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setConvoName(value);
  };

  const handleSubmitNewConvoName = () => {
    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        name: convoName,
      });
    }
    setShowConvoNameDone(false);
  };

  const handleClickOptionsForUser = (userId: string, isAdmin: boolean) => {
    setOptionsDialogUser({
      ...optionsDialogUser,
      userId,
      isAdmin,
      nickname: convoUserNicknameMap[userId] || '',
    });
    setOpenOptionsDialog(true);
  };

  const handleRemoveFromGroup = () => {
    const convoUser = conversationUsers?.find(
      (user) => user.id === optionsDialogUser.userId
    );
    const { id, photo } = convoUser!;
    const newConvoMessageUsers = conversationUsers!
      .filter((user) => user.id !== id)
      .map((user) => ({
        name: user.name,
        photoS3Key: user.photo,
        userId: user.id,
        username: user.username,
      }));
    const newConvoAvatarS3Keys = conversationUsers
      ?.map((user) => user.photo)
      .filter((s3Key) => s3Key !== photo);
    const newConvoMessageUserNames = newConvoMessageUsers.map(
      (user) => user.name
    );
    const newConvoAdminUsers = conversationAdminUsers!.filter(
      (user) => user !== id
    );

    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        connectedUsers: newConvoMessageUsers,
        connectedUserNames: newConvoMessageUserNames,
        avatarS3Keys: newConvoAvatarS3Keys,
        adminUsers: newConvoAdminUsers,
      });
    }

    setOpenOptionsDialog(false);
  };

  const handleAddOrRemoveAsAdmin = () => {
    const isAdmin = optionsDialogUser.isAdmin;
    const convoUser = conversationUsers?.find(
      (user) => user.id === optionsDialogUser.userId
    );
    const { id } = convoUser!;
    let newConvoAdminUsers = [...conversationAdminUsers!];
    if (isAdmin) {
      newConvoAdminUsers = newConvoAdminUsers!.filter((user) => user !== id);
    } else {
      newConvoAdminUsers!.push(id);
      newConvoAdminUsers.sort();
    }

    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        adminUsers: newConvoAdminUsers,
      });
    }

    setOpenOptionsDialog(false);
  };

  const handleBlurOptionsDialog = () => setOpenOptionsDialog(false);

  const handleBlurSetNicknameDialog = () => setShowNicknameChangeDialog(false);

  const handleSubmitNewConvoNameEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitNewConvoName();
    }
  };

  const handleClickInfoIcon = () => {
    setIsInfoClicked(!isInfoClicked);
  };

  const handleShowAddPeopleModal = () => {
    setShowConvoDialog(true);
    setIsExistingConvo(true);
  };

  const handleUpdateNicknameForConvoUser = () => {
    if (convoUserNicknameMap) {
      const userId = optionsDialogUser.userId;
      const nickname = optionsDialogUser.nickname;

      socket.emit('updateUserNicknameForConversation', {
        conversationId,
        userId,
        nickname,
      });
    }
  };

  const handleUploadConversationPhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      const formData = new FormData();

      formData.append('conversation-photo', file, file.name);
      formData.append('conversationId', conversationId);

      if (currentConversationAvatarPhotos?.length === 1) {
        formData.append(
          'existingConvoPhoto',
          currentConversationAvatarPhotos[0]
        );
      }

      dispatch(uploadConversationPhotoStart(formData));
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
            onScroll={handleMessagesContainerScroll}
          >
            {messagesArrayReversed?.map((message, idx) => {
              const renderTime =
                idx === 0 ||
                shouldRenderTimeStamp(
                  messagesArrayReversed[idx - 1].created,
                  message.created
                );

              return (
                <Grid
                  key={message.id}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
                  {renderTime && (
                    <Grid
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '15px',
                      }}
                    >
                      <Typography sx={{ fontSize: '14px' }}>
                        {renderTimeStamp(message.created)}
                      </Typography>
                    </Grid>
                  )}
                  <MessageComponent
                    id={message.id}
                    userInfo={userInfoMap[message.ownerId]}
                    message={message}
                    isCurrentUser={message.ownerId === currentUser?.id}
                    isGroupConversation={
                      !!(
                        conversationHistoricalMessageUsers &&
                        conversationHistoricalMessageUsers.length > 2
                      )
                    }
                    islastMessageFromDiffUser={
                      idx === 0 ||
                      (idx >= 1 &&
                        messagesArrayReversed[idx - 1].ownerId !==
                          userInfoMap[message.ownerId]?.id)
                    }
                    userNickname={convoUserNicknameMap[message.ownerId] || ''}
                    renderedWithTimeStamp={renderTime}
                    custRef={idx === 0 ? observedElementRef : null}
                  />
                </Grid>
              );
            })}
            <Grid ref={messagesEndRef} />
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
                justifyContent: 'space-between',
                margin: '8px 0px',
                padding: '0px 16px',
              }}
            >
              <Typography sx={{ fontWeight: 600, lineHeight: 2 }}>
                Members
              </Typography>
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
                  sx={{
                    color: '#0095F6',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                  }}
                >
                  Add People
                </Typography>
              </Button>
            </Grid>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                height: '15px',
                paddingRight: '16px',
              }}
            >
              <Button
                variant='text'
                component='label'
                sx={{
                  display: 'flex',
                  padding: '6px 5px',
                  '&:hover': {
                    backgroundColor: 'unset',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: '#0095F6',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                  }}
                >
                  Change Photo
                </Typography>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleUploadConversationPhoto}
                  style={{ display: 'none' }}
                />
              </Button>
            </Grid>
            {conversationActiveMessageUsers?.map((user) => {
              const userInfo = userInfoMap[user];
              const isAdmin = !!conversationAdminUsers?.find(
                (admin) => admin === user
              );
              const isNotCurrentUser = userInfo?.id !== currentUser?.id;
              const nickname =
                (userInfo && convoUserNicknameMap[userInfo.id!]) || '';

              return (
                <Grid
                  container
                  sx={{
                    display: 'flex',
                    height: '72px',
                    padding: '8px 16px',
                    justifyContent: 'space-between',
                  }}
                  key={userInfo?.id}
                >
                  <Grid item sx={{ display: 'flex' }}>
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
                      item
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: '12px',
                        textAlign: 'left',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {userInfo?.username}
                      </Typography>
                      <Typography>
                        {isAdmin && `Admin · `}
                        {userInfo?.name}
                        {nickname && ` · Nickname: ${nickname}`}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                    }}
                  >
                    {isNotCurrentUser && (
                      <Button
                        sx={{
                          display: 'flex',
                          '&:hover': {
                            backgroundColor: 'unset',
                          },
                        }}
                        onClick={() =>
                          handleClickOptionsForUser(userInfo?.id!, isAdmin)
                        }
                      >
                        <MoreHorizIcon sx={{ color: 'black' }} />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
      <ConversationUserOptionsDialog
        open={openOptionsDialog}
        setOpen={setOpenOptionsDialog}
        userId={optionsDialogUser.userId}
        isAdmin={optionsDialogUser.isAdmin}
        handleRemoveFromGroup={handleRemoveFromGroup}
        handleAddOrRemoveAsAdmin={handleAddOrRemoveAsAdmin}
        setShowNicknameChangeDialog={setShowNicknameChangeDialog}
        onBlur={handleBlurOptionsDialog}
      />
      <SetConvoUserNicknameDialog
        open={showNicknameChangeDialog}
        onClose={handleBlurSetNicknameDialog}
        optionsDialogUser={optionsDialogUser}
        setOptionsDialogUser={setOptionsDialogUser}
        handleSubmitNewNickname={handleUpdateNicknameForConvoUser}
        convoUserNicknameMap={convoUserNicknameMap}
      />
    </Grid>
  );
};

export default Conversation;
