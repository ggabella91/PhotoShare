import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Grid, Typography, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CreateOrUpdateConvoDialog from './create-or-update-convo-dialog.component';
import ConversationPreview from '../../components/conversation/conversation-preview.component';
import ConversationComponent from '../../components/conversation/conversation.component';

import {
  selectCurrentUser,
  selectConversationUsers,
} from '../../redux/user/user.selectors';
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
  generateFinalConvoUsersAndS3KeysArrays,
  getConvoName,
} from './messages-page.utils';
import { MessageUser } from '../../redux/message/message.types';

interface MessagesPageProps {
  openNewConvoModal?: boolean;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ openNewConvoModal }) => {
  const [showConvoDialog, setShowConvoDialog] = useState(!!openNewConvoModal);
  const [isExistingConvo, setIsExistingConvo] = useState(false);
  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);
  const joinedCoversations = useSelector(selectJoinedConversations);
  const usersArrayForNewConvoReq = useSelector(selectUsersArrayForNewConvoReq);
  const conversationUsers = useSelector(selectConversationUsers);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const avatarS3Keys = joinedCoversations?.find(
    (convo) => convo.id === conversationId
  )?.avatarS3Keys || [''];

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
      setShowConvoDialog(false);
      dispatch(resetConvoUsersArray());
      navigate(`/direct/t/${conversation.id}`, { replace: true });
    });

    socket.on('joinedConversations', (conversations) => {
      dispatch(addToJoinedConversationsArray(conversations));
    });

    socket.on('chatToClient', (message) => {
      dispatch(addMessageToConversation(message));

      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });
    });

    socket.on('conversationUpdated', () => {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });
    });
  }, [socket]);

  useEffect(() => {
    if (joinedCoversations?.length) {
      joinedCoversations.forEach((convo) =>
        dispatch(
          getConvoMessagesStart({
            conversationId: convo.id,
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
    navigate('/direct/new', { replace: true });
    setShowConvoDialog(true);
  };

  const handleClickNext = () => {
    if (
      isSocketConnectionActive &&
      usersArrayForNewConvoReq.length &&
      currentUser
    ) {
      let finalUsersArray: Partial<MessageUser>[] = usersArrayForNewConvoReq;

      if (isExistingConvo && conversationUsers) {
        const currentConvoMessageUsers = conversationUsers.map((user) => ({
          name: user.name,
          photoS3Key: user.photo,
          userId: user.id,
          username: user.username,
        }));
        finalUsersArray = [...finalUsersArray, ...currentConvoMessageUsers];
      }

      const { usersArray, avatarS3Keys, convoUserNames } =
        generateFinalConvoUsersAndS3KeysArrays(finalUsersArray, currentUser);

      if (!isExistingConvo) {
        socket.emit('createConversation', {
          name: 'default',
          connectedUsers: usersArray,
          avatarS3Keys,
          connectedUserNames: convoUserNames,
        });
      } else {
        socket.emit('updateConversation', {
          id: conversationId,
          connectedUsers: usersArray,
          avatarS3Keys,
          connectedUserNames: convoUserNames,
        });
      }

      dispatch(clearUserSuggestions());
    }
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
        padding: '20px',
      }}
    >
      <Grid
        sx={{
          display: 'flex',
          position: 'relative',
          minHeight: '800px',
          width: '95vw',
          maxWidth: '935px',
        }}
      >
        <Grid container>
          <Grid
            item
            sx={{
              border: '1px solid rgb(219,219,219)',
              minWidth: '350px',
              maxWidth: '350px',
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                height: '60px',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid rgb(219,219,219)',
                padding: '0 20px',
              }}
            >
              <Grid
                xs={2}
                sx={{ marginRight: '8px', display: 'flex', flexBasis: '32px' }}
              />
              <Grid xs={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {currentUser?.username || ''}
                </Typography>
              </Grid>
              <Grid xs={2} sx={{ display: 'flex' }}>
                <Button
                  sx={{
                    marginTop: '5px',
                    '&:hover': { backgroundColor: 'unset' },
                  }}
                  onClick={handleSendMessage}
                >
                  <RateReviewIcon fontSize='large' sx={{ color: 'black' }} />
                </Button>
              </Grid>
            </Grid>
            <Grid
              sx={{
                width: '100%',
                overflow: 'hidden auto',
                height: 'calc(100% - 60px)',
                paddingTop: '8px',
              }}
            >
              {joinedCoversations?.length
                ? joinedCoversations.map((convo) => {
                    return (
                      <ConversationPreview
                        key={convo.id}
                        conversationId={convo.id}
                        conversationName={getConvoName(convo, currentUser)}
                        avatarS3Keys={convo.avatarS3Keys}
                        setIsInfoClicked={setIsInfoClicked}
                      />
                    );
                  })
                : null}
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              display: 'flex',
              position: 'absolute',
              left: '350px',
              height: '100%',
              maxWidth: '585px',
              width: '50vw',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1px solid rgb(219,219,219)',
              borderLeft: 'none',
            }}
          >
            {!!conversationId ? (
              <ConversationComponent
                conversationId={conversationId}
                avatarS3Keys={avatarS3Keys}
                socket={socket}
                isInfoClicked={isInfoClicked}
                setIsInfoClicked={setIsInfoClicked}
                setShowConvoDialog={setShowConvoDialog}
                setIsExistingConvo={setIsExistingConvo}
              />
            ) : (
              renderNoActiveConvosScreen()
            )}
          </Grid>
        </Grid>
        <CreateOrUpdateConvoDialog
          showNewMessageDialog={showConvoDialog}
          setShowConvoDialog={setShowConvoDialog}
          usersArrayForNewConvoReq={usersArrayForNewConvoReq}
          handleClickNext={handleClickNext}
          isExistingConvo={isExistingConvo}
        />
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
