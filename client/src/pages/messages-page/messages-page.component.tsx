import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { Grid, Typography, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NewConvoDialog from './new-convo-dialog.component';
import ConversationPreview from '../../components/conversation/conversation-preview.component';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { clearUserSuggestions } from '../../redux/user/user.actions';

import { clearSuggestionPhotoFileArray } from '../../redux/post/post.actions';

import {
  selectMessageUser,
  selectJoinedConversations,
  selectUsersArrayForNewConvoReq,
} from '../../redux/message/message.selectors';

import {
  findOrCreateUserStart,
  removeUserSessionCookieStart,
  addToJoinedConversationsArray,
  addMessageToConversation,
  getConvoMessagesStart,
  resetConvoUsersArray,
} from '../../redux/message/message.actions';

import {
  generateDefaultConvoName,
  generateFinalConvoUsersArrayAndGetAvatarS3Key,
} from './messages-page.utils';

const MessagesPage: React.FC = () => {
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [isViewingConversation, setIsViewingConversation] = useState(false);

  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);
  const joinedCoversations = useSelector(selectJoinedConversations);
  const usersArrayForNewConvoReq = useSelector(selectUsersArrayForNewConvoReq);

  const dispatch = useDispatch();

  const socket = useMemo(
    () =>
      io(`wss://${window.location.host}`, {
        path: '/api/messages/chat',
        port: 443,
        query: { userId: currentUser?.id || '' },
      }),
    []
  );

  useEffect(() => {
    dispatch(clearUserSuggestions());
    dispatch(clearSuggestionPhotoFileArray());
  }, []);

  useEffect(() => {
    // When component unmounts, such as when the user
    // signs out
    return () => {
      if (isSocketConnectionActive) {
        socket.emit('forceDisconnectClient');
      }
    };
  }, [socket, isSocketConnectionActive]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connection established with messages server');

      setIsSocketConnectionActive(true);

      if (currentUser) {
        dispatch(
          findOrCreateUserStart({
            userId: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            photoS3Key: currentUser.photo,
          })
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from messages server');

      setIsSocketConnectionActive(false);
    });

    socket.on('joinedConversation', (conversation) => {
      dispatch(addToJoinedConversationsArray(conversation));
      setShowNewMessageDialog(false);
      dispatch(resetConvoUsersArray());
    });

    socket.on('joinedConversations', (conversations) => {
      dispatch(addToJoinedConversationsArray(conversations));
    });

    socket.on('chatToClient', (message) => {
      dispatch(addMessageToConversation(message));
    });
  }, [socket]);

  const handleClickNext = () => {
    if (
      isSocketConnectionActive &&
      usersArrayForNewConvoReq.length &&
      currentUser
    ) {
      const convoName = generateDefaultConvoName(usersArrayForNewConvoReq);
      const { usersArray, avatarS3Key } =
        generateFinalConvoUsersArrayAndGetAvatarS3Key(
          usersArrayForNewConvoReq,
          currentUser
        );

      socket.emit('createConversation', {
        name: convoName,
        connectedUsers: usersArray,
        avatarS3Key,
      });

      dispatch(clearUserSuggestions());
    }
  };

  useEffect(() => {
    if (joinedCoversations?.length) {
      joinedCoversations.forEach((convo) =>
        dispatch(
          getConvoMessagesStart({
            conversationId: convo._id,
            limit: 10,
            pageToShow: 1,
          })
        )
      );
    }
  }, [joinedCoversations]);

  useEffect(() => {
    if (!currentUser && messageUser && isSocketConnectionActive) {
      const { userId } = messageUser;

      dispatch(removeUserSessionCookieStart(userId));
    }
  }, [currentUser, messageUser, isSocketConnectionActive]);

  useEffect(() => {
    if (
      isSocketConnectionActive &&
      messageUser &&
      !joinedExistingConversations
    ) {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });

      setJoinedExistingConversations(true);
    }
  }, [
    socket,
    currentUser?.id,
    messageUser,
    isSocketConnectionActive,
    joinedExistingConversations,
  ]);

  const handleSendMessage = () => {
    setShowNewMessageDialog(true);
  };

  const renderNoActiveConvosScreen = () => {
    return (
      <Grid>
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '25px',
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              border: '2px solid black',
              borderRadius: '50%',
              width: '6em',
              height: '6em',
              justifyContent: 'center',
            }}
          >
            <SendIcon
              fontSize='large'
              sx={{
                alignSelf: 'center',
                margin: '0 0 12px 12px',
                width: '2em',
                height: '2em',
                transform: 'rotate(336deg)',
              }}
            />
          </Grid>
        </Grid>
        <Typography sx={{ fontSize: 20, marginBottom: '10px' }}>
          Your Messages
        </Typography>
        <Typography sx={{ fontSize: 14, marginBottom: '15px' }}>
          Send private messages to a friend or group
        </Typography>
        <Button
          variant='contained'
          onClick={handleSendMessage}
          sx={{ textTransform: 'capitalize' }}
        >
          Send Message
        </Button>
      </Grid>
    );
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        fontFamily: 'fontFamily',
      }}
    >
      <Grid
        sx={{
          display: 'flex',
          position: 'relative',
          minHeight: '800px',
          width: '85vw',
          maxWidth: '935px',
          border: '1px solid rgb(219,219,219)',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={4}
            sx={{
              borderRight: '1px solid rgb(219,219,219)',
              width: '350px',
              overflowY: 'scroll',
            }}
          >
            {joinedCoversations?.length
              ? joinedCoversations.map((convo) => {
                  // TODO: Add styling and avatar to conversation preview
                  return (
                    <ConversationPreview
                      key={convo._id}
                      conversationName={convo.name}
                      avatarS3Key={convo.avatarS3Key}
                    />
                  );
                })
              : null}
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {isViewingConversation ? (
              <Grid></Grid>
            ) : (
              renderNoActiveConvosScreen()
            )}
          </Grid>
        </Grid>
        <NewConvoDialog
          showNewMessageDialog={showNewMessageDialog}
          setShowNewMessageDialog={setShowNewMessageDialog}
          usersArrayForNewConvoReq={usersArrayForNewConvoReq}
          handleClickNext={handleClickNext}
        />
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
