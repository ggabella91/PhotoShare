import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Avatar,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ConversationUserOptionsDialog from './conversation-user-options-dialog.component';
import SetConvoUserNicknameDialog from './set-convo-user-nickname-dialog.component';
import { Socket } from 'socket.io-client';
import {
  selectCurrentUser,
  selectConversationUsers,
} from '../../redux/user/user.selectors';
import { selectConversationUserNicknamesMaps } from '../../redux/message/message.selectors';
import { Conversation } from '../../redux/message/message.types';
import { uploadConversationPhotoStart } from '../../redux/post/post.actions';
import { UserInfoData } from '../search-bar/search-bar.component';

export type UserInfoMap = Record<string, UserInfoData>;

export interface OptionsDialogUser {
  userId: string;
  isAdmin: boolean;
  nickname: string;
}

interface ConversationDetailsProps {
  currentConversation: Conversation | undefined;
  socket: Socket;
  conversationId: string;
  userInfoMap: UserInfoMap;
  setShowConvoDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsExistingConvo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  currentConversation,
  socket,
  conversationId,
  userInfoMap,
  setShowConvoDialog,
  setIsExistingConvo,
}) => {
  const [convoName, setConvoName] = useState('');
  const [showConvoNameDone, setShowConvoNameDone] = useState(false);
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [optionsDialogUser, setOptionsDialogUser] = useState<OptionsDialogUser>(
    {
      userId: '',
      isAdmin: false,
      nickname: '',
    }
  );
  const [showNicknameChangeDialog, setShowNicknameChangeDialog] =
    useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const conversationUsers = useSelector(selectConversationUsers);
  const conversationActiveMessageUsers = currentConversation?.connectedUsers;
  const conversationAdminUsers = currentConversation?.adminUsers;
  const currentConversationAvatarPhotos = currentConversation?.avatarS3Keys;
  const allConversationUserNicknamesMaps = useSelector(
    selectConversationUserNicknamesMaps
  );
  const convoUserNicknameMap = allConversationUserNicknamesMaps[conversationId];
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentConversation && currentConversation.name !== 'default') {
      setConvoName(currentConversation.name);
    } else if (currentConversation) {
      setConvoName('');
    }
  }, [currentConversation]);

  useEffect(() => {
    if (currentConversation && convoName) {
      setShowConvoNameDone(
        !!(convoName?.length && convoName !== currentConversation?.name)
      );
    } else if (currentConversation) {
      setShowConvoNameDone(false);
    }
  }, [currentConversation, convoName]);

  useEffect(() => {
    socket.on('convoUserNicknameUpdated', () => {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });

      setShowNicknameChangeDialog(false);
      setOpenOptionsDialog(false);
    });
  }, [socket, currentUser]);

  const handleChangeConvoName = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setConvoName(value);
  };

  const handleSubmitNewConvoNameEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitNewConvoName();
    }
  };

  const handleSubmitNewConvoName = () => {
    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        name: convoName,
      });
    }
    setShowConvoNameDone(false);
  };

  const handleShowAddPeopleModal = () => {
    setShowConvoDialog(true);
    setIsExistingConvo(true);
  };

  const handleUploadConversationPhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      const formData = new FormData();

      formData.append('conversation-photo', file, file.name);
      formData.append('conversationId', conversationId);

      if (currentConversationAvatarPhotos?.length === 1) {
        formData.append(
          'existingConvoPhoto',
          currentConversationAvatarPhotos[0]
        );
      }

      dispatch(uploadConversationPhotoStart(formData));
    }
  };

  const handleClickOptionsForUser = (userId: string, isAdmin: boolean) => {
    setOptionsDialogUser({
      ...optionsDialogUser,
      userId,
      isAdmin,
      nickname: convoUserNicknameMap[userId] || '',
    });
    setOpenOptionsDialog(true);
  };

  const handleRemoveFromGroup = () => {
    const convoUser = conversationUsers?.find(
      (user) => user.id === optionsDialogUser.userId
    );
    const { id, photo } = convoUser!;
    const newConvoMessageUsers = conversationUsers!
      .filter((user) => user.id !== id)
      .map((user) => ({
        name: user.name,
        photoS3Key: user.photo,
        userId: user.id,
        username: user.username,
      }));
    const newConvoAvatarS3Keys = conversationUsers
      ?.map((user) => user.photo)
      .filter((s3Key) => s3Key !== photo);
    const newConvoMessageUserNames = newConvoMessageUsers.map(
      (user) => user.name
    );
    const newConvoAdminUsers = conversationAdminUsers!.filter(
      (user) => user !== id
    );

    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        connectedUsers: newConvoMessageUsers,
        connectedUserNames: newConvoMessageUserNames,
        avatarS3Keys: newConvoAvatarS3Keys,
        adminUsers: newConvoAdminUsers,
      });
    }

    setOpenOptionsDialog(false);
  };

  const handleAddOrRemoveAsAdmin = () => {
    const isAdmin = optionsDialogUser.isAdmin;
    const convoUser = conversationUsers?.find(
      (user) => user.id === optionsDialogUser.userId
    );
    const { id } = convoUser!;
    let newConvoAdminUsers = [...conversationAdminUsers!];
    if (isAdmin) {
      newConvoAdminUsers = newConvoAdminUsers!.filter((user) => user !== id);
    } else {
      newConvoAdminUsers!.push(id);
      newConvoAdminUsers.sort();
    }

    if (currentUser) {
      socket.emit('updateConversation', {
        updatingUser: currentUser.id,
        id: conversationId,
        adminUsers: newConvoAdminUsers,
      });
    }

    setOpenOptionsDialog(false);
  };

  const handleBlurOptionsDialog = () => setOpenOptionsDialog(false);

  const handleBlurSetNicknameDialog = () => setShowNicknameChangeDialog(false);

  const handleUpdateNicknameForConvoUser = () => {
    if (convoUserNicknameMap) {
      const userId = optionsDialogUser.userId;
      const nickname = optionsDialogUser.nickname;

      socket.emit('updateUserNicknameForConversation', {
        conversationId,
        userId,
        nickname,
      });
    }
  };

  const handleClickLeaveConversation = () => {
    // TODO Add confirmation modal for leaving a conversation,
    // which when confirmed (by pressing "Leave"), will send
    // websocket message to remove user from conversation.
    // This handler function should toggle the modal to visible
  };

  return (
    <Grid>
      <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
        <Grid sx={{ display: 'flex', padding: '10px' }}>
          <Typography sx={{ marginRight: '10px' }}>
            Conversation Name:{' '}
          </Typography>
          <TextField
            sx={{
              input: {
                border: 'none',
                padding: '2px 0px',
              },
              width: '60%',
            }}
            label=''
            placeholder='Add a name'
            fullWidth
            value={convoName}
            onChange={handleChangeConvoName}
            onKeyDown={handleSubmitNewConvoNameEnterKey}
            InputProps={{
              endAdornment: showConvoNameDone && (
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
                    onClick={handleSubmitNewConvoName}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'unset',
                      },
                    }}
                  >
                    <Typography
                      sx={{ color: '#0095F6', textTransform: 'capitalize' }}
                    >
                      Done
                    </Typography>
                  </Button>
                </InputAdornment>
              ),
              style: {
                fontSize: '14px',
                padding: '0px 14px',
                borderRadius: '20px',
              },
              sx: {
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              },
            }}
          />
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid rgb(219,219,219)',
            borderBottom: '1px solid rgb(219,219,219)',
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '8px 0px',
              padding: '0px 16px',
            }}
          >
            <Typography sx={{ fontWeight: 600, lineHeight: 2 }}>
              Members
            </Typography>
            <Button
              variant='text'
              size='small'
              onClick={handleShowAddPeopleModal}
              sx={{
                '&:hover': {
                  backgroundColor: 'unset',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#0095F6',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                }}
              >
                Add People
              </Typography>
            </Button>
          </Grid>
          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              height: '15px',
              paddingRight: '16px',
            }}
          >
            <Button
              variant='text'
              component='label'
              sx={{
                display: 'flex',
                padding: '6px 5px',
                '&:hover': {
                  backgroundColor: 'unset',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#0095F6',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                }}
              >
                Change Photo
              </Typography>
              <input
                type='file'
                accept='image/*'
                onChange={handleUploadConversationPhoto}
                style={{ display: 'none' }}
              />
            </Button>
          </Grid>
          {conversationActiveMessageUsers?.map((user) => {
            const userInfo = userInfoMap[user];
            const isAdmin = !!conversationAdminUsers?.find(
              (admin) => admin === user
            );
            const isNotCurrentUser = userInfo?.id !== currentUser?.id;
            const nickname =
              (userInfo && convoUserNicknameMap[userInfo.id!]) || '';

            return (
              <Grid
                container
                sx={{
                  display: 'flex',
                  height: '72px',
                  padding: '8px 16px',
                  justifyContent: 'space-between',
                }}
                key={userInfo?.id}
              >
                <Grid item sx={{ display: 'flex' }}>
                  <Avatar
                    src={
                      userInfo?.profilePhotoFileString
                        ? `data:image/jpeg;base64,${userInfo.profilePhotoFileString}`
                        : ''
                    }
                    alt={userInfo?.name || ''}
                    sx={{ height: '56px', width: '56px' }}
                  />
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {userInfo?.username}
                    </Typography>
                    <Typography>
                      {isAdmin && `Admin · `}
                      {userInfo?.name}
                      {nickname && ` · Nickname: ${nickname}`}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Button
                    sx={{
                      display: 'flex',
                      '&:hover': {
                        backgroundColor: 'unset',
                      },
                    }}
                    onClick={() =>
                      handleClickOptionsForUser(userInfo?.id!, isAdmin)
                    }
                  >
                    <MoreHorizIcon sx={{ color: 'black' }} />
                  </Button>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Grid
          sx={{
            display: 'flex',
            borderTop: '1px solid rgb(219,219,219)',
            borderBottom: '1px solid rgb(219,219,219)',
          }}
        >
          <Button
            variant='text'
            size='small'
            onClick={handleClickLeaveConversation}
            sx={{
              '&:hover': {
                backgroundColor: 'unset',
              },
            }}
          >
            <Typography sx={{ fontSize: 14, color: 'red' }}>
              Leave Conversation
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <ConversationUserOptionsDialog
        open={openOptionsDialog}
        setOpen={setOpenOptionsDialog}
        isNotCurrentUser={optionsDialogUser.userId !== currentUser?.id}
        isAdmin={optionsDialogUser.isAdmin}
        handleRemoveFromGroup={handleRemoveFromGroup}
        handleAddOrRemoveAsAdmin={handleAddOrRemoveAsAdmin}
        setShowNicknameChangeDialog={setShowNicknameChangeDialog}
        onBlur={handleBlurOptionsDialog}
      />
      <SetConvoUserNicknameDialog
        open={showNicknameChangeDialog}
        onClose={handleBlurSetNicknameDialog}
        optionsDialogUser={optionsDialogUser}
        setOptionsDialogUser={setOptionsDialogUser}
        handleSubmitNewNickname={handleUpdateNicknameForConvoUser}
        convoUserNicknameMap={convoUserNicknameMap}
      />
    </Grid>
  );
};

export default ConversationDetails;
