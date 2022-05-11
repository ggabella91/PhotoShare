import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  Autocomplete,
  TextField,
} from '@mui/material';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import {
  selectMessageUser,
  selectJoinedCoversations,
} from '../../redux/message/message.selectors';
import {
  findOrCreateUserStart,
  removeUserSessionCookieStart,
  addToJoinedConversationsArray,
  addMessageToConversation,
} from '../../redux/message/message.actions';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = useState();
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [isViewingConversation, setIsViewingConversation] = useState(false);

  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);

  const location = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);
  const joinedCoversations = useSelector(selectJoinedCoversations);

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
    });

    socket.on('joinedConversations', (conversations) => {
      dispatch(addToJoinedConversationsArray(conversations));
    });

    socket.on('chatToClient', (message) => {
      dispatch(addMessageToConversation(message));
    });
  }, [socket]);

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

      socket.emit('createConversation', {
        name: 'Test Convo',
        connectedUsers: [currentUser?.id],
      });
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

  const handleCloseDialog = () => {
    setShowNewMessageDialog(false);
  };

  const renderNoActiveConvosScreen = () => {
    return (
      <Grid>
        <Typography sx={{ fontSize: 20 }}>Your Messages</Typography>
        <Typography sx={{ fontSize: 14 }}>
          Send private messages to a friend or group
        </Typography>
        <Button variant='contained' onClick={handleSendMessage}>
          Send Message
        </Button>
      </Grid>
    );
  };

  return (
    <Grid sx={{ display: 'flex', position: 'relative', minHeight: '800px' }}>
      <Grid container>
        <Grid
          item
          xs={4}
          sx={{ borderRight: '1px solid rgb(219,219,219)' }}
        ></Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {isViewingConversation ? <Grid></Grid> : renderNoActiveConvosScreen()}
        </Grid>
      </Grid>
      <Dialog onClose={handleCloseDialog} open={showNewMessageDialog}>
        <DialogTitle>New Message</DialogTitle>
        <Autocomplete
          multiple
          options={[]}
          getOptionLabel={(option: string) => option}
          defaultValue={['']}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              label='Search'
              placeholder=''
            />
          )}
        />
      </Dialog>
    </Grid>
  );
};

export default MessagesPage;
