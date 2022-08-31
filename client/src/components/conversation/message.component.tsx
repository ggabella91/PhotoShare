import React, { useState, useRef } from 'react';
import { Grid, Avatar, Typography, Button, Popover } from '@mui/material';
import { UserInfoData } from '../search-bar/search-bar.component';
import { Message } from '../../redux/message/message.types';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';

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
  messageRef: CustomRef;
  onRemoveMessage: () => void;
  onForwardMessage: () => void;
  onReplyToMessage: () => void;
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
  messageRef,
  onRemoveMessage,
  onForwardMessage,
  onReplyToMessage,
}) => {
  const [showOptionsButtons, setShowOptionsButtons] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const addMarginTop = isCurrentUser && renderedWithTimeStamp;
  const renderWithNameOrNickname =
    isGroupConversation && !isCurrentUser && islastMessageFromDiffUser;
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

  // TODO Add button with functionality for replying to a message.
  // Should render message being replied to, overlayed by message
  // being sent as the reply

  // TODO Limit options for messages that are removed (hidden)

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
                  <MoreVertIcon
                    fontSize='small'
                    sx={{ color: 'black', transform: 'translateY(-18px)' }}
                  />
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
                    </Grid>
                  </Popover>
                )}
              </Grid>
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
                  <ReplyIcon
                    fontSize='small'
                    sx={{ color: 'black', transform: 'translateY(-18px)' }}
                  />
                </Button>
              </Grid>
            </Grid>
          )}
          <Grid
            sx={{
              display: 'flex',
              borderRadius: '20px',
              padding: '10px',
              alignItems: 'center',
              backgroundColor: message.hidden ? 'none' : 'rgb(239, 239, 239)',
              border: message.hidden ? '1px solid rgb(219,219,219)' : 'unset',
              marginBottom: '8px',
              marginTop: addMarginTop ? '15px' : '0px',
            }}
            ref={messageRef}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontStyle: message.hidden ? 'italic' : 'unset',
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MessageComponent;
