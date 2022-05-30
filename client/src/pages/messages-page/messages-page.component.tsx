import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import {
  Chip,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import { List } from 'immutable';
import { useDebounce } from '../hooks';
import { UserInfoData } from '../../components/search-bar/search-bar.component';
import UserDetailsContainer from '../../components/user-details/UserDetailsContainer.component';

import { User } from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectUserSuggestions,
} from '../../redux/user/user.selectors';
import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import {
  FileRequestType,
  PostFile,
  PostFileReq,
  UserType,
  Location,
} from '../../redux/post/post.types';
import { selectSuggestionPhotoFileArray } from '../../redux/post/post.selectors';
import {
  getPostFileStart,
  clearSuggestionPhotoFileArray,
} from '../../redux/post/post.actions';

import { MessageUser } from '../../redux/message/message.types';
import {
  selectMessageUser,
  selectJoinedCoversations,
  selectUsersArrayForNewConvoReq,
} from '../../redux/message/message.selectors';
import {
  findOrCreateUserStart,
  removeUserSessionCookieStart,
  addToJoinedConversationsArray,
  addMessageToConversation,
  getConvoMessagesStart,
  removeUserFromConvoUsersArray,
} from '../../redux/message/message.actions';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = useState();
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [isViewingConversation, setIsViewingConversation] = useState(false);

  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);
  const [userSearchString, setUserSearchString] = useState('');
  const [userSuggestionsList, setUserSuggestionsList] = useState<
    List<UserInfoData>
  >(List());
  const [noProfilePhotosToFetch, setNoProfilePhotosToFetch] = useState(false);
  const location = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);
  const joinedCoversations = useSelector(selectJoinedCoversations);
  const userSuggestions = useSelector(selectUserSuggestions);
  const userSuggestionProfilePhotoFiles = useSelector(
    selectSuggestionPhotoFileArray
  );
  const usersArrayForNewConvoReq = useSelector(selectUsersArrayForNewConvoReq);
  const usersArrayLength = useRef<number>(0);

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

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
    clearUserSuggestions();
    setUserSuggestionsList(List());
    clearSuggestionPhotoFileArray();
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

  const debouncedUserSearchString = useDebounce(userSearchString, 1000);

  useEffect(() => {
    if (debouncedUserSearchString.length >= 3) {
      dispatch(getUserSuggestionsStart(debouncedUserSearchString));
    }
  }, [debouncedUserSearchString]);

  useEffect(() => {
    if (userSuggestions && userSuggestions.length) {
      let count = 0;

      for (let user of userSuggestions) {
        if (user.photo) {
          count++;
          getPostFileStart({
            user: UserType.suggestionArray,
            bucket,
            s3Key: user.photo,
            fileRequestType: FileRequestType.singlePost,
          });
        }
      }

      if (count === 0) {
        setNoProfilePhotosToFetch(true);
      }
    }
  }, [userSuggestions]);

  useEffect(() => {
    if (userSuggestions && userSuggestionProfilePhotoFiles?.length) {
      const userSuggestionsAsList = List(userSuggestions);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => {
          let photoFileString: string;

          userSuggestionProfilePhotoFiles.forEach((file) => {
            if (el.photo === file.s3Key) {
              photoFileString = file.fileString;
            }
          });

          return {
            id: el.id,
            name: el.name,
            username: el.username,
            photo: el.photo || '',
            profilePhotoFileString: photoFileString!,
            location: {} as Location,
            comment: '',
          };
        }
      );

      setUserSuggestionsList(suggestedUser);
    } else if (userSuggestions && noProfilePhotosToFetch) {
      const userSuggestionsAsList = List(userSuggestions);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => ({
          id: el.id,
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: '',
          location: {} as Location,
          comment: '',
        })
      );

      setUserSuggestionsList(suggestedUser);
    }
  }, [
    userSuggestions,
    userSuggestionProfilePhotoFiles,
    noProfilePhotosToFetch,
  ]);

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
    if (joinedCoversations?.length) {
      joinedCoversations.forEach((convo) =>
        dispatch(
          getConvoMessagesStart({
            conversationId: convo.id,
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

  useEffect(() => {
    if (usersArrayForNewConvoReq.length >= usersArrayLength.current) {
      setUserSearchString('');
    }
    usersArrayLength.current = usersArrayForNewConvoReq.length;
  }, [usersArrayForNewConvoReq]);

  const handleSendMessage = () => {
    setShowNewMessageDialog(true);
  };

  const handleCloseDialog = () => {
    setShowNewMessageDialog(false);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setUserSearchString(value);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    const elementParent = event.currentTarget.parentElement;
    const userId = elementParent!.dataset.userid;

    dispatch(removeUserFromConvoUsersArray(userId!));
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
                  return (
                    <Grid sx={{ width: '100%', height: '80px' }} key={convo.id}>
                      {convo.name}
                    </Grid>
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
        <Dialog
          onClose={handleCloseDialog}
          open={showNewMessageDialog}
          PaperProps={{
            sx: { width: 400, height: 470 },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            New Message
          </DialogTitle>
          <TextField
            sx={{ padding: '5px 15px' }}
            variant='standard'
            label='Search'
            placeholder=''
            onChange={handleTextChange}
            InputProps={{
              sx: { height: '2.5rem', display: 'flex', alignItems: 'center' },
              startAdornment: !!usersArrayForNewConvoReq.length && (
                <Grid sx={{ marginRight: '10px', display: 'flex' }}>
                  {usersArrayForNewConvoReq.map((user) => (
                    <Chip
                      sx={{
                        color: 'rgb(0, 149, 246)',
                        backgroundColor: 'rgb(224,241,255)',
                        marginRight: '5px',
                      }}
                      label={user.username}
                      key={user.id}
                      data-userid={user.id}
                      onDelete={handleDelete}
                      deleteIcon={
                        <ClearIcon
                          style={{
                            color: 'rgb(0, 149, 246)',
                          }}
                        />
                      }
                    />
                  ))}
                </Grid>
              ),
              value: userSearchString,
            }}
            InputLabelProps={{ sx: { paddingLeft: '15px' } }}
          />
          <Grid sx={{ height: 'auto' }}>
            <UserDetailsContainer userDataList={userSuggestionsList} />
          </Grid>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
