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
import ConversationDetails from './conversation-details.component';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';
import ForwardMessageDialog from './forward-message-dialog.component';
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
import { getOtherUserStart } from '../../redux/user/user.actions';

import { UserInfoData } from '../search-bar/search-bar.component';
import { Socket } from 'socket.io-client';
import { getConvoName } from '../../pages/messages-page/messages-page.utils';
import { shouldRenderTimeStamp, renderTimeStamp } from './conversation.utils';
import { useLazyLoading } from '../../pages/hooks';
import { Message } from '../../redux/message/message.types';

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
  const [convoUserNicknameMap, setConvoUserNicknameMap] = useState<
    Record<string, string>
  >({});
  const [showForwardMessageDialog, setShowForwardMessageDialog] =
    useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(
    null
  );
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

  const conversationUserNicknames = currentConversation?.userNicknames;
  const currentConversationMessages = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages?.messages;
  const messagesArrayLength = messagesArray?.length;
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
      messagesArrayLength &&
      totalMessagesForConvo &&
      intersectionCounter !== pageToFetch.current[conversationId] &&
      messagesArrayLength < totalMessagesForConvo &&
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
    messagesArrayLength,
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

  const handleRemoveMessage = (messageId: string) => {
    socket.emit('removeMessage', {
      conversationId,
      messageId,
    });
  };

  const handleShowForwardMessageDialog = (message: Message) => {
    setShowForwardMessageDialog(true);
    setMessageToForward(message);
  };

  const handleForwardMessage = (conversationId: string) => {
    if (currentUser && messageToForward) {
      socket.emit('chatToServer', {
        text: messageToForward.text,
        created: new Date(),
        ownerId: currentUser.id,
        conversationId,
      });
    }
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

  const handleClickInfoIcon = () => {
    setIsInfoClicked(!isInfoClicked);
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
                    onRemoveMessage={() => handleRemoveMessage(message.id)}
                    onForwardMessage={() =>
                      handleShowForwardMessageDialog(message)
                    }
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
          <ForwardMessageDialog
            showForwardMessageDialog={showForwardMessageDialog}
            setShowForwardMessageDialog={setShowForwardMessageDialog}
            onSendMessage={(conversationId: string) =>
              handleForwardMessage(conversationId)
            }
          />
        </>
      ) : (
        <ConversationDetails
          conversationId={conversationId}
          currentConversation={currentConversation}
          socket={socket}
          userInfoMap={userInfoMap}
          convoUserNicknameMap={convoUserNicknameMap}
          setIsExistingConvo={setIsExistingConvo}
          setShowConvoDialog={setShowConvoDialog}
        />
      )}
    </Grid>
  );
};

export default Conversation;
