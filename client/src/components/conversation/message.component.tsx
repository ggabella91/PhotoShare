import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Avatar,
  Typography,
  Button,
  Popover,
  Tooltip,
  ButtonBase,
} from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { renderTimeStamp } from './conversation.utils';

import { selectConversationToUserDataMap } from '../../redux/message/message.selectors';

import { selectConversationUserNicknamesMaps } from '../../redux/message/message.selectors';
import { MessageSeenByUser } from './conversation.component';

type CustomRef = (node: HTMLDivElement | null) => void;

interface MessageComponentProps {
  id: string;
  userInfo: UserInfoData;
  message: Message;
  currentUserId: string | undefined;
  isGroupConversation: boolean;
  islastMessageFromDiffUser: boolean;
  renderedWithTimeStamp: boolean;
  custRef: CustomRef | null;
  messageRef: CustomRef;
  onRemoveMessage: () => void;
  onForwardMessage: () => void;
  onReplyToMessage: () => void;
  onClickMessageRepliedTo: (messageId: string) => void;
  messageReplyingToText?: string;
  lastMessageSeenRef: React.MutableRefObject<string>;
  setMessageSeenByUsers: React.Dispatch<
    React.SetStateAction<MessageSeenByUser[]>
  >;
  onClickMessageSeenByUsers: () => void;
  activeConvoUsers: string[];
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  id,
  userInfo,
  message,
  currentUserId,
  isGroupConversation,
  islastMessageFromDiffUser,
  renderedWithTimeStamp,
  custRef,
  messageRef,
  onRemoveMessage,
  onForwardMessage,
  onReplyToMessage,
  onClickMessageRepliedTo,
  messageReplyingToText,
  lastMessageSeenRef,
  setMessageSeenByUsers,
  onClickMessageSeenByUsers,
  activeConvoUsers,
}) => {
  const [showOptionsButtons, setShowOptionsButtons] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const conversationToUserDataMap = useSelector(
    selectConversationToUserDataMap
  );
  const userDataMap = conversationToUserDataMap[message.conversationId];
  const userNicknamesMaps = useSelector(selectConversationUserNicknamesMaps);
  const userNickname =
    userNicknamesMaps[message.conversationId][message.ownerId];
  const messageReplyingToOwnerNickname =
    message.messageReplyingToOwnerId &&
    userNicknamesMaps[message.conversationId][message.messageReplyingToOwnerId];
  const isCurrentUser = currentUserId === message.ownerId;
  const addMarginTop =
    (isCurrentUser && islastMessageFromDiffUser) ||
    (isCurrentUser && renderedWithTimeStamp) ||
    message.isReply;
  const renderWithNameOrNickname =
    isGroupConversation && !isCurrentUser && islastMessageFromDiffUser;
  const isRepliedToMessageOwnerCurrentUser =
    message.isReply && message.messageReplyingToOwnerId === currentUserId;
  const messageLastSeenBy = message.usersForWhomMessageWasLastOneSeen;
  const StatusComponent =
    message.status === 'sending'
      ? RadioButtonUncheckedIcon
      : message.status === 'sent'
      ? CheckCircleOutlinedIcon
      : CheckCircleIcon;
  const formattedStatus = message.status
    ? message.status.charAt(0).toUpperCase() + message.status.slice(1)
    : '';

  useEffect(() => {
    if (
      currentUserId &&
      messageLastSeenBy.map((user) => user.userId).includes(currentUserId) &&
      message.id > lastMessageSeenRef.current
    ) {
      lastMessageSeenRef.current = message.id;
    }
  }, [currentUserId, lastMessageSeenRef, message.id, messageLastSeenBy]);

  const moreIconButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleClickMore = () => {
    setOpenPopover(true);
  };

  const handleMouseEnter = () => setShowOptionsButtons(true);

  const handleMouseLeave = () => setShowOptionsButtons(false);

  const handleClosePopover = () => {
    setOpenPopover(false);
    setShowOptionsButtons(false);
  };

  const handleRemoveMessage = () => {
    onRemoveMessage();
    setOpenPopover(false);
    setShowOptionsButtons(false);
  };

  const handleForwardMessage = () => {
    onForwardMessage();
    setOpenPopover(false);
    setShowOptionsButtons(false);
  };

  const handleClickReply = () => {
    onReplyToMessage();
  };

  const handleClickMessageRepliedTo = () => {
    message.messageReplyingToId &&
      onClickMessageRepliedTo(message.messageReplyingToId);
  };

  const handleSeenByAvatarClick = () => {
    const messageSeenByUsers: MessageSeenByUser[] = messageLastSeenBy
      .filter((user) => user.userId !== currentUserId)
      .map((user, idx) => {
        const userData = userDataMap?.[user.userId];
        const avatarFileString = userData?.profilePhotoFileString;
        const userNickname =
          userNicknamesMaps[message.conversationId][user.userId];

        return {
          userNameOrNickname: userNickname || userData?.name || '',
          avatarFileString: avatarFileString || '',
          seenTime: user.seenTime,
        };
      });

    setMessageSeenByUsers(messageSeenByUsers);
    onClickMessageSeenByUsers();
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
      }}
      id={id}
      ref={custRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderWithNameOrNickname && !message.isReply && (
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
      {message.isReply && (
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
              margin: '25px 0px 2px 48px',
              marginTop: '15px !important',
              marginLeft: isCurrentUser ? 'unset' : '35px',
              marginRight: isCurrentUser ? '5px' : 'unset',
            }}
          >
            <Typography sx={{ fontSize: '10px' }}>
              <ReplyIcon sx={{ fontSize: '12px', marginBottom: '2px' }} />
              {` ${
                isCurrentUser
                  ? 'You'
                  : userNickname
                  ? userNickname
                  : userInfo?.name.split(' ')[0]
              } replied to ${
                isRepliedToMessageOwnerCurrentUser
                  ? `${isCurrentUser ? 'yourself' : 'you'}`
                  : messageReplyingToOwnerNickname
                  ? messageReplyingToOwnerNickname
                  : message.messageReplyingToOwnerName?.split(' ')[0]
              }`}
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: 'flex',
              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                position: 'absolute',
                zIndex: '10',
                top: '30px',
                borderRadius: '20px',
                padding: '10px',
                alignItems: 'center',
                backgroundColor: 'rgb(208, 208, 208)',
                marginLeft: isCurrentUser ? 'unset' : '40px',
                marginRight: isCurrentUser ? '5px' : 'unset',
                marginBottom: '5px',
                maxWidth: '345px',
                cursor: 'pointer',
                '&:active': {
                  outline: 'Highlight auto 1px',
                },
                '&:focus-visible': {
                  outline: 'Highlight 1px auto',
                },
              }}
            >
              <Button
                sx={{
                  width: '100%',
                  minWidth: 'unset',
                  height: '100%',
                  textTransform: 'unset',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: 'unset',
                  },
                }}
                disableRipple
                onClick={handleClickMessageRepliedTo}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontStyle: 'unset',
                    color: 'black',
                    textAlign: 'start',
                  }}
                >
                  {messageReplyingToText}
                </Typography>
              </Button>
            </Grid>
          </Grid>
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
            message.isReply || (!isGroupConversation && renderedWithTimeStamp)
              ? '15px'
              : '0px',
        }}
        ref={messageRef}
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
            flexDirection: isCurrentUser ? 'row' : 'row-reverse',
          }}
        >
          {showOptionsButtons && (
            <Grid sx={{ display: 'flex' }}>
              <Grid sx={{ display: 'flex' }}>
                <Button
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    paddingBottom: 0,
                    '&:hover': {
                      backgroundColor: 'unset',
                    },
                  }}
                  onClick={handleClickMore}
                  ref={moreIconButtonRef}
                >
                  <Tooltip title='More'>
                    <MoreVertIcon
                      fontSize='small'
                      sx={{ color: 'black', transform: 'translateY(-18px)' }}
                    />
                  </Tooltip>
                </Button>
                {moreIconButtonRef.current && (
                  <Popover
                    id={id}
                    open={openPopover}
                    anchorEl={moreIconButtonRef.current}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                  >
                    <Grid
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '136px',
                        height: message.hidden ? '43px' : '86px',
                      }}
                    >
                      <Grid sx={{ display: 'flex' }}>
                        <Button
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            width: '100%',
                            height: '43px',
                            paddingLeft: '15px',
                          }}
                          onClick={handleRemoveMessage}
                        >
                          <Typography
                            sx={{
                              color: 'black',
                              textTransform: 'capitalize',
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </Typography>
                        </Button>
                      </Grid>
                      {!message.hidden && (
                        <Grid sx={{ display: 'flex' }}>
                          <Button
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              width: '100%',
                              height: '43px',
                              paddingLeft: '15px',
                            }}
                            onClick={handleForwardMessage}
                          >
                            <Typography
                              sx={{
                                color: 'black',
                                textTransform: 'capitalize',
                                fontWeight: 600,
                              }}
                            >
                              Forward
                            </Typography>
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Popover>
                )}
              </Grid>
              {!message.hidden && (
                <Grid sx={{ display: 'flex' }}>
                  <Button
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      paddingBottom: 0,
                      '&:hover': {
                        backgroundColor: 'unset',
                      },
                    }}
                    onClick={handleClickReply}
                  >
                    <Tooltip title='Reply'>
                      <ReplyIcon
                        fontSize='small'
                        sx={{ color: 'black', transform: 'translateY(-18px)' }}
                      />
                    </Tooltip>
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
          <Grid
            sx={{
              display: 'flex',
              borderRadius: '20px',
              padding: '10px',
              alignItems: 'center',
              zIndex: 20,
              backgroundColor: message.hidden ? 'none' : 'rgb(238, 238, 238)',
              border: message.hidden ? '1px solid rgb(224,224,224)' : 'unset',
              marginBottom: '8px',
              marginTop: addMarginTop ? '15px' : '0px',
              maxWidth: '365px',
            }}
          >
            <Tooltip
              title={`${message.hidden ? 'Sent: ' : ''}${renderTimeStamp(
                message.created
              )}${
                message.hidden
                  ? `\nUnsent: ${renderTimeStamp(message.messageHiddenTime)}`
                  : ''
              }`}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontStyle: message.hidden ? 'italic' : 'unset',
                  textAlign: 'start',
                }}
              >
                {message.hidden
                  ? `${
                      isCurrentUser
                        ? 'You unsent a message'
                        : 'Message unsent by user'
                    }`
                  : message.text}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          height: 'auto',
          marginTop: '-4px',
          marginBottom: '8px',
        }}
      >
        <Grid sx={{ display: 'flex', width: 'auto' }}>
          {message.hasBeenViewedByOtherUsers === false &&
            currentUserId === message.ownerId && (
              <Tooltip title={formattedStatus}>
                <StatusComponent
                  sx={{
                    height: '14px',
                    width: '14px',
                    color: 'rgb(28, 30, 33)',
                  }}
                />
              </Tooltip>
            )}
          {!!messageLastSeenBy.length &&
            messageLastSeenBy
              .filter(
                (user) =>
                  user.userId !== currentUserId &&
                  activeConvoUsers.includes(user.userId)
              )
              .map((user, idx) => {
                const userData = userDataMap && userDataMap[user.userId];
                const avatarFileString = userData?.profilePhotoFileString;
                const userNickname =
                  userNicknamesMaps[message.conversationId][user.userId] ||
                  userData?.name;

                const title = `Seen by ${userNickname} at ${renderTimeStamp(
                  user.seenTime
                )}`;

                const seenByLength = messageLastSeenBy.filter(
                  (user) => user.userId !== currentUserId
                ).length;

                return (
                  <Tooltip title={title} key={idx}>
                    <Avatar
                      src={
                        !!avatarFileString
                          ? `data:image/jpeg;base64,${avatarFileString}`
                          : ''
                      }
                      alt={title}
                      sx={{
                        height: '14px',
                        width: '14px',
                        margin: '0 1px',
                        '&:hover': { cursor: 'pointer' },
                      }}
                      component={(seenByLength > 1 && ButtonBase) || 'div'}
                      onClick={handleSeenByAvatarClick}
                    />
                  </Tooltip>
                );
              })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MessageComponent;
