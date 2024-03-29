import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
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

import {
  selectMessageUser,
  selectJoinedConversations,
  selectUsersArrayForNewConvoReq,
  selectOldestMessageToConvoMap,
} from '../../redux/message/message.selectors';

import {
  removeUserSessionCookieStart,
  addToJoinedConversationsArray,
  getConvoMessagesStart,
  resetConvoUsersArray,
  removeMessageFromConversation,
  permanentlyRemoveMessageForUser,
  removeFromConversationToUserDataMap,
} from '../../redux/message/message.actions';

import {
  generateFinalConvoUsersAndS3KeysArrays,
  getConvoName,
} from './messages-page.utils';
import { Conversation, MessageUser } from '../../redux/message/message.types';

interface MessagesPageProps {
  openNewConvoModal?: boolean;
  socket: Socket;
  isSocketConnectionActive: boolean;
}

// REVIEW - Determine what optimizations can be made so that users
// and other data aren't fetched every time the user leaves the
// messages page and returns to it without reloading the browser page

const MessagesPage: React.FC<MessagesPageProps> = ({
  socket,
  openNewConvoModal,
  isSocketConnectionActive,
}) => {
  const [showConvoDialog, setShowConvoDialog] = useState(!!openNewConvoModal);
  const [isExistingConvo, setIsExistingConvo] = useState(false);
  const [isInfoClicked, setIsInfoClicked] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const usersArrayForNewConvoReq = useSelector(selectUsersArrayForNewConvoReq);
  const conversationUsers = useSelector(selectConversationUsers);
  const oldestMessageToConvoMap = useSelector(selectOldestMessageToConvoMap);

  const navigate = useNavigate();
  const { conversationId } = useParams();
  const currentConversation = joinedConversations?.find(
    (conversation) => conversation.id === conversationId
  );
  const conversationActiveMessageUsers = currentConversation?.connectedUsers;
  const avatarS3Keys = joinedConversations?.find(
    (convo) => convo.id === conversationId
  )?.avatarS3Keys || [''];
  const previouslyJoinedConversations = useRef<Conversation[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('joinedConversation', (conversation) => {
      dispatch(addToJoinedConversationsArray(conversation));
      setShowConvoDialog(false);
      dispatch(resetConvoUsersArray());
      navigate(`/direct/t/${conversation.id}`, { replace: true });
    });

    socket.on('messageRemoved', (message) => {
      dispatch(removeMessageFromConversation(message));
    });

    socket.on('messagePermanentlyRemovedForUser', (message) => {
      dispatch(permanentlyRemoveMessageForUser(message));
    });

    socket.on('conversationUpdated', () => {
      setShowConvoDialog(false);
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });
    });

    socket.on('updatedPhotoForUserInConversation', (conversationId: string) => {
      dispatch(removeFromConversationToUserDataMap(conversationId));
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });
    });

    socket.on('userRemovedFromConversation', () => {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });
      navigate('/direct/inbox');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

  useEffect(() => {
    if (
      joinedConversations &&
      joinedConversations.length !==
        previouslyJoinedConversations.current.length
    ) {
      const newConvos = joinedConversations.filter(
        (convo) =>
          !previouslyJoinedConversations.current.some(
            (prevConvo) => prevConvo.id === convo.id
          )
      );

      newConvos.forEach((convo) => {
        const oldestMessageId = oldestMessageToConvoMap?.[convo.id];

        if (!oldestMessageId) {
          dispatch(
            getConvoMessagesStart({
              conversationId: convo.id,
              limit: 10,
              beforeMessageId: 'start',
              getTotal: true,
            })
          );
        }
      });

      previouslyJoinedConversations.current = [...joinedConversations];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, joinedConversations]);

  useEffect(() => {
    if (!currentUser && messageUser && isSocketConnectionActive) {
      const { userId } = messageUser;

      dispatch(removeUserSessionCookieStart(userId));
    }
  }, [dispatch, currentUser, messageUser, isSocketConnectionActive]);

  const handleSendMessage = () => {
    window.history.pushState({}, '', '/direct/new');
    setShowConvoDialog(true);
  };

  const handleClickNext = () => {
    if (
      isSocketConnectionActive &&
      usersArrayForNewConvoReq.length &&
      currentUser
    ) {
      let finalUsersArray: Partial<MessageUser>[] = usersArrayForNewConvoReq;

      if (
        isExistingConvo &&
        conversationUsers &&
        conversationActiveMessageUsers
      ) {
        const currentConvoMessageUsers = conversationUsers
          .filter((user) => conversationActiveMessageUsers.includes(user.id))
          .map((user) => ({
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
          creator: currentUser.id,
          name: 'default',
          connectedUsers: usersArray,
          avatarS3Keys,
          connectedUserNames: convoUserNames,
        });
      } else {
        if (currentUser) {
          socket.emit('updateConversation', {
            updatingUser: currentUser.id,
            id: conversationId,
            connectedUsers: usersArray,
            avatarS3Keys,
            connectedUserNames: convoUserNames,
          });
        }
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
                item
                xs={2}
                sx={{ marginRight: '8px', display: 'flex', flexBasis: '32px' }}
              />
              <Grid
                item
                xs={8}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {currentUser?.username || ''}
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ display: 'flex' }}>
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
              {joinedConversations?.length
                ? joinedConversations.map((convo) => {
                    return (
                      <ConversationPreview
                        key={convo.id}
                        conversationId={convo.id}
                        conversationName={getConvoName(convo, currentUser)}
                        avatarS3Keys={convo.avatarS3Keys}
                        setIsInfoClicked={setIsInfoClicked}
                        conversationImageS3Key={convo.conversationImageS3Key}
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
          conversationActiveMessageUsers={conversationActiveMessageUsers}
        />
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
