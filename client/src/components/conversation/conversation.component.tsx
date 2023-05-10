import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  WheelEvent,
  FocusEvent,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  IconButton,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import MessageComponent from './message.component';
import ConversationDetails from './conversation-details.component';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';
import ForwardMessageDialog from './forward-message-dialog.component';
import MessageSeenByUsersDialog from './message-seen-by-dialog.component';
import { useUserInfoData, useLazyLoading } from '../../hooks';

import {
  selectJoinedConversations,
  selectConversationMessages,
  selectIsLoadingMessages,
  selectConversationToUserDataMap,
  selectOldestMessageToConvoMap,
  selectStopFetchingMessageForConvoMap,
} from '../../redux/message/message.selectors';
import {
  getConvoMessagesStart,
  addToConversationToUserDataMap,
  addConversationUserNicknamesMap,
  updateMessageLastSeenBy,
  addMessageToConversation,
  updateMessageStatus,
  setOldestMessageForConversation,
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
import { Message } from '../../redux/message/message.types';

import './emoji-picker.scss';

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

export interface MessageSeenByUser {
  userNameOrNickname: string;
  avatarFileString: string;
  seenTime: string;
}

interface MessageViewedBy {
  message: Message;
  viewedBy: string;
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
  const [showForwardMessageDialog, setShowForwardMessageDialog] =
    useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(
    null
  );
  const [isReplyModeOn, setIsReplyModeOn] = useState(false);
  const [messageToReplyTo, setMessageToReplyTo] = useState<Message | null>(
    null
  );
  const [messagesArrayReversed, setMessagesArrayReversed] = useState<Message[]>(
    []
  );
  const [openMessageSeenByUserDialog, setOpenMessageSeenByUserDialog] =
    useState(false);
  const [messageSeenByUsers, setMessageSeenByUsers] = useState<
    MessageSeenByUser[]
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [areFirstMessagesLoaded, setAreFirstMessagesLoaded] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);
  const conversationToUserDataMap = useSelector(
    selectConversationToUserDataMap
  );
  const isLoadingMessages = useSelector(selectIsLoadingMessages);
  const oldestMessageToConvoMap = useSelector(selectOldestMessageToConvoMap);
  const oldestMessageId = oldestMessageToConvoMap?.[conversationId];
  const currentConversation = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const stopFetchingMessageForConvoMap = useSelector(
    selectStopFetchingMessageForConvoMap
  );
  const stopFetchingMessages = stopFetchingMessageForConvoMap[conversationId];
  const conversationHistoricalMessageUsers =
    currentConversation?.historicalUsers;
  const conversationActiveUsers = currentConversation?.connectedUsers;
  const usersInfoList = useUserInfoData(conversationUsers);
  const {
    intersectionCounter,
    observedElementRef,
    elementId: previousOldestMessageId,
  } = useLazyLoading(isLoadingMessages, true, 1000);

  const conversationUserNicknames = currentConversation?.userNicknames;
  const currentConversationMessages = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages?.messages;
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const messageJustSent = useRef(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const scrolledToBottomRef = useRef(false);
  const scrollingInMessagesContainerRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesRepliedTo = useRef<Record<string, Message>>({});
  const lastMessageIdSeenRef = useRef('');
  const allMessagesRefsMap: Record<string, HTMLDivElement | null> = {};
  const receivedMessages = useRef<Record<string, boolean>>({});
  const intersectionCounterRef = useRef<number | null>(null);
  const searchingForOriginalMessage = useRef('');
  const previousOldestVisibleMessage = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const shouldFetchMoreMessages = () =>
      intersectionCounter !== intersectionCounterRef.current &&
      oldestMessageId &&
      !stopFetchingMessages;

    if (shouldFetchMoreMessages()) {
      intersectionCounterRef.current = intersectionCounter;
      previousOldestVisibleMessage.current =
        allMessagesRefsMap[previousOldestMessageId];

      dispatch(
        getConvoMessagesStart({
          conversationId,
          limit: 10,
          beforeMessageId: oldestMessageId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, conversationId, intersectionCounter]);

  useEffect(() => {
    if (
      !conversationToUserDataMap?.[conversationId] &&
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
    const cachedUserData = conversationToUserDataMap?.[conversationId];

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
    // TODO Add logic for handling when to delete a
    // conversationToUserDataMap entry, such as when
    // a user updates their profile photo, since this
    // entry data gets cached

    if (
      !conversationToUserDataMap?.[conversationId] &&
      conversationHistoricalMessageUsers &&
      conversationHistoricalMessageUsers.every((key) =>
        userInfoMap.hasOwnProperty(key)
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

      dispatch(
        addConversationUserNicknamesMap({
          conversationId,
          userNicknameMap: convoUserNicknameMap,
        })
      );
    }
  }, [dispatch, conversationId, conversationUserNicknames]);

  useEffect(() => {
    setIsInfoClicked(false);
  }, [conversationId, setIsInfoClicked]);

  useEffect(() => {
    if (!scrolledToBottomRef.current || areFirstMessagesLoaded) {
      messagesRef.current?.scrollIntoView();
      scrolledToBottomRef.current = true;
    }
  }, [conversationId, areFirstMessagesLoaded]);

  const messagesEndRef = (node: HTMLDivElement) => {
    messagesRef.current = node;
  };

  useEffect(() => {
    if (!scrollingInMessagesContainerRef.current) {
      previousOldestVisibleMessage.current?.scrollIntoView();
    }

    if (messagesArray?.length && !areFirstMessagesLoaded) {
      setAreFirstMessagesLoaded(true);
    }

    if (messagesArray && currentUser) {
      const messagesReversed = [...messagesArray]
        .sort((a, b) => {
          if (a.id > b.id) {
            return 1;
          } else if (a.id < b.id) {
            return -1;
          } else {
            return 0;
          }
        })
        .filter(
          (message) =>
            !message.usersMessageIsRemovedFor.includes(currentUser.id)
        );
      setMessagesArrayReversed(messagesReversed);
    }

    messagesArray?.forEach((message) => {
      if (
        message.isReply &&
        !(message.messageReplyingToId! in messagesRepliedTo.current)
      ) {
        socket.emit('findSingleMessage', {
          messageId: message.messageReplyingToId,
        });
      }

      if (message.ownerId !== currentUser?.id && message.status === 'sent') {
        socket.emit('updateMessageStatus', {
          conversationId: message.conversationId,
          messageId: message.id,
          status: 'delivered',
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesArray, currentUser, socket]);

  useEffect(() => {
    socket.on('chatToClient', (message: Message) => {
      const messageAlreadyAdded = receivedMessages.current[message.id];

      if (!messageAlreadyAdded) {
        if (message.ownerId !== currentUser?.id) {
          receivedMessages.current[message.id] = true;

          dispatch(
            addMessageToConversation({ ...message, status: 'delivered' })
          );

          socket.emit('updateMessageStatus', {
            conversationId: message.conversationId,
            messageId: message.id,
            status: 'delivered',
          });
        } else if (message.status !== 'delivered') {
          dispatch(updateMessageStatus(message));
        }
      }

      if (currentUser?.id === message.ownerId) {
        handleMessagesContainerFocus(true, message.id);
      }
    });

    socket.on(
      'foundSingleMessage',
      (message: Message) => (messagesRepliedTo.current[message.id] = message)
    );

    socket.on('userMessageLastViewedByUpdated', (message: MessageViewedBy) => {
      if (message.message) {
        dispatch(updateMessageLastSeenBy(message));
      }
    });

    socket.on('messageStatusUpdated', (message: Message) => {
      if (currentUser?.id === message.ownerId) {
        dispatch(updateMessageStatus(message));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

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
      const messageToSend = {
        text: trimmedMessage,
        created: new Date(),
        ownerId: currentUser.id,
        conversationId,
        ...(isReplyModeOn && { isReply: true }),
        ...(isReplyModeOn &&
          messageToReplyTo && { messageReplyingToId: messageToReplyTo.id }),
        ...(isReplyModeOn &&
          messageToReplyTo && {
            messageReplyingToOwnerId: messageToReplyTo.ownerId,
          }),
        ...(isReplyModeOn &&
          messageToReplyTo && {
            messageReplyingToOwnerName:
              userInfoMap[messageToReplyTo.ownerId].name.split(' ')[0],
          }),
        usersForWhomMessageWasLastOneSeen: [
          { seenTime: new Date().toISOString(), userId: currentUser.id },
        ],
        hasBeenViewedByOtherUsers: false,
      };

      socket.emit('chatToServer', messageToSend);
      dispatch(
        addMessageToConversation({
          ...messageToSend,
          status: 'sending',
          created: messageToSend.created.toISOString(),
          id: '',
          messageHiddenTime: '',
          usersMessageIsRemovedFor: [],
        })
      );
    }

    if (isReplyModeOn) {
      handleTurnOffReplyMode();
    }

    setMessage('');
  };

  const handleRemoveMessage = (
    messageId: string,
    isHidden: boolean | undefined
  ) => {
    if (!isHidden) {
      socket.emit('removeMessage', {
        conversationId,
        messageId,
      });
    } else if (currentUser) {
      socket.emit('permanentlyRemoveMessageForUser', {
        userId: currentUser.id,
        conversationId,
        messageId,
      });
    }
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
        usersForWhomMessageWasLastOneSeen: [],
      });
    }
  };

  const handleBeginReplyToMessage = (message: Message) => {
    setIsReplyModeOn(true);
    setMessageToReplyTo(message);
  };

  const handleTurnOffReplyMode = () => {
    setIsReplyModeOn(false);
    setMessageToReplyTo(null);
  };

  const handleClickMessageRepliedTo = (messageId: string) => {
    const originalMessage = allMessagesRefsMap[messageId];

    if (originalMessage) {
      searchingForOriginalMessage.current = '';
      originalMessage.scrollIntoView();
      messagesContainerRef.current?.scrollBy({ top: -20 });
    } else {
      searchingForOriginalMessage.current = messageId;

      dispatch(
        getConvoMessagesStart({
          conversationId,
          limit: 10,
          beforeMessageId: oldestMessageId,
        })
      );
    }
  };

  // REVIEW May need to add check for whether stopFetchingMessagesForConvo is true for this conditional

  const handleStoreMessageRef = (
    node: HTMLDivElement | null,
    messageId: string
  ) => {
    if (allMessagesRefsMap[messageId] && searchingForOriginalMessage.current) {
      handleClickMessageRepliedTo(searchingForOriginalMessage.current);
    }

    allMessagesRefsMap[messageId] = node;
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

  const handleMessagesContainerFocus = (
    isMessageOwner: boolean = false,
    messageId: string = ''
  ) => {
    const latestMessage = messagesArrayReversed.at(-1);

    if (
      socket &&
      currentUser &&
      ((latestMessage && latestMessage.id >= lastMessageIdSeenRef.current) ||
        (isMessageOwner && messageId))
    ) {
      socket.emit('updateUsersMessageLastViewedBy', {
        conversationId,
        messageId: latestMessage?.id || messageId,
        userId: currentUser.id,
        isMessageOwner: isMessageOwner || false,
      });
    }
  };

  const handleClickMessageSeenByUsers = () =>
    setOpenMessageSeenByUserDialog(true);

  const handleCloseMessageSeenByUsersDialog = () =>
    setOpenMessageSeenByUserDialog(false);

  const handleClickEmojiPickerIcon = () =>
    setShowEmojiPicker((showEmojiPicker) => !showEmojiPicker);

  const handleBlurEmojiPicker = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage((message) => message + emojiData.emoji);

    setShowEmojiPicker(false);
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
              conversationImageS3Key={
                currentConversation?.conversationImageS3Key
              }
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
            ref={messagesContainerRef}
            tabIndex={0}
            onFocus={() => handleMessagesContainerFocus()}
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
                    key={message.id}
                    userInfo={userInfoMap[message.ownerId]}
                    message={message}
                    currentUserId={currentUser?.id}
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
                    renderedWithTimeStamp={renderTime}
                    custRef={idx === 0 ? observedElementRef : null}
                    messageRef={(node) =>
                      handleStoreMessageRef(node, message.id)
                    }
                    onRemoveMessage={() =>
                      handleRemoveMessage(message.id, message.hidden)
                    }
                    onForwardMessage={() =>
                      handleShowForwardMessageDialog(message)
                    }
                    onReplyToMessage={() => handleBeginReplyToMessage(message)}
                    onClickMessageRepliedTo={(messageId: string) =>
                      handleClickMessageRepliedTo(messageId)
                    }
                    messageReplyingToText={
                      message.messageReplyingToId
                        ? messagesRepliedTo.current[message.messageReplyingToId]
                            ?.text
                        : ''
                    }
                    lastMessageSeenRef={lastMessageIdSeenRef}
                    setMessageSeenByUsers={setMessageSeenByUsers}
                    onClickMessageSeenByUsers={handleClickMessageSeenByUsers}
                    activeConvoUsers={conversationActiveUsers || []}
                  />
                </Grid>
              );
            })}
            <Grid ref={messagesEndRef} />
          </Grid>
          {isReplyModeOn && (
            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: '1px solid rgb(219,219,219)',
              }}
            >
              <Grid
                sx={{
                  display: 'flex',
                  position: 'relative',
                  paddingLeft: '10px',
                  paddingTop: '5px',
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {messageToReplyTo &&
                    `Replying to ${
                      messageToReplyTo?.ownerId === currentUser?.id
                        ? 'yourself'
                        : userInfoMap[messageToReplyTo.ownerId].name.split(
                            ' '
                          )[0]
                    }`}
                </Typography>
                <Button
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    minWidth: 'unset',
                    padding: 0,
                    '&:hover': { backgroundColor: 'unset' },
                  }}
                  onClick={handleTurnOffReplyMode}
                >
                  <CloseIcon fontSize='small' sx={{ color: 'black' }} />
                </Button>
              </Grid>
              <Grid sx={{ display: 'flex', paddingLeft: '10px' }}>
                <Typography sx={{ fontSize: 13 }}>
                  {messageToReplyTo?.text}
                </Typography>
              </Grid>
            </Grid>
          )}
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
            onFocus={() => handleMessagesContainerFocus()}
          >
            {showEmojiPicker && (
              <Grid onBlur={handleBlurEmojiPicker}>
                <EmojiPicker
                  emojiStyle={EmojiStyle.NATIVE}
                  onEmojiClick={handleEmojiClick}
                />
              </Grid>
            )}
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
                  startAdornment: (
                    <InputAdornment
                      position='start'
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '25px',
                      }}
                    >
                      <IconButton
                        aria-label='toggle display emoji picker'
                        sx={{ display: 'flex' }}
                        onClick={handleClickEmojiPickerIcon}
                      >
                        <InsertEmoticonIcon fontSize='medium' />
                      </IconButton>
                    </InputAdornment>
                  ),
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
          <MessageSeenByUsersDialog
            open={openMessageSeenByUserDialog}
            onClose={handleCloseMessageSeenByUsersDialog}
            messageSeenByUsers={messageSeenByUsers}
          />
        </>
      ) : (
        <ConversationDetails
          conversationId={conversationId}
          currentConversation={currentConversation}
          socket={socket}
          userInfoMap={userInfoMap}
          setIsExistingConvo={setIsExistingConvo}
          setShowConvoDialog={setShowConvoDialog}
        />
      )}
    </Grid>
  );
};

export default Conversation;
