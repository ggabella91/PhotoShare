import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Avatar,
  Typography,
  Button,
  Popover,
  Tooltip,
} from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';
import { selectConversationUserNicknamesMaps } from '../../redux/message/message.selectors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import { renderTimeStamp } from './conversation.utils';

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
}) => {
  const [showOptionsButtons, setShowOptionsButtons] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const userNicknamesMaps = useSelector(selectConversationUserNicknamesMaps);
  const userNickname =
    currentUserId && userNicknamesMaps[message.conversationId][currentUserId];
  const messageReplyingToOwnerNickname =
    message.messageReplyingToOwnerId &&
    userNicknamesMaps[message.conversationId][message.messageReplyingToOwnerId];
  const isCurrentUser = currentUserId === message.ownerId;
  const addMarginTop =
    (isCurrentUser && renderedWithTimeStamp) || message.isReply;
  const renderWithNameOrNickname =
    isGroupConversation && !isCurrentUser && islastMessageFromDiffUser;
  const isRepliedToMessageOwnerCurrentUser =
    message.isReply && message.messageReplyingToOwnerId === currentUserId;
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

  if (
    currentUserId &&
    message.usersMessageIsRemovedFor.includes(currentUserId)
  ) {
    return null;
  }

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
              marginLeft: isCurrentUser ? 'unset' : '15px',
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
                backgroundColor: 'rgb(239, 239, 239)',
                marginLeft: isCurrentUser ? 'unset' : '15px',
                marginRight: isCurrentUser ? '5px' : 'unset',
                marginBottom: '5px',
                maxWidth: '345px',
                cursor: 'pointer',
                '&:focus-visible': {
                  outline: 'Highlight 1px auto',
                },
              }}
            >
              <Button
                sx={{
                  width: '100%',
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
                        height: '86px',
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
              backgroundColor: message.hidden ? 'none' : 'rgb(222, 222, 222)',
              border: message.hidden ? '1px solid rgb(219,219,219)' : 'unset',
              marginBottom: '8px',
              marginTop: addMarginTop ? '15px' : '0px',
              maxWidth: '365px',
            }}
          >
            <Tooltip title={renderTimeStamp(message.created)}>
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
    </Grid>
  );
};

export default MessageComponent;
