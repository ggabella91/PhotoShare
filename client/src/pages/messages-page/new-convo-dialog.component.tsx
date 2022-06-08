import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Chip,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '../hooks';

import UserDetailsContainer from '../../components/user-details/UserDetailsContainer.component';

import { getUserSuggestionsStart } from '../../redux/user/user.actions';

import { MessageUser } from '../../redux/message/message.types';
import { removeUserFromConvoUsersArray } from '../../redux/message/message.actions';
import { List } from 'immutable';
import { UserInfoData } from '../../components/search-bar/search-bar.component';

interface NewConvoDialogProps {
  showNewMessageDialog: boolean;
  setShowNewMessageDialog: React.Dispatch<React.SetStateAction<boolean>>;
  usersArrayForNewConvoReq: Partial<MessageUser>[];
  handleClickNext: () => void;
  userSuggestionsList: List<UserInfoData>;
}

const NewConvoDialog: React.FC<NewConvoDialogProps> = ({
  showNewMessageDialog,
  setShowNewMessageDialog,
  usersArrayForNewConvoReq,
  handleClickNext,
  userSuggestionsList,
}) => {
  const [userSearchString, setUserSearchString] = useState('');

  const usersArrayLength = useRef<number>(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (usersArrayForNewConvoReq.length >= usersArrayLength.current) {
      setUserSearchString('');
    }
    usersArrayLength.current = usersArrayForNewConvoReq.length;
  }, [usersArrayForNewConvoReq]);

  const debouncedUserSearchString = useDebounce(userSearchString, 1000);

  useEffect(() => {
    if (debouncedUserSearchString.length >= 3) {
      dispatch(getUserSuggestionsStart(debouncedUserSearchString));
    }
  }, [debouncedUserSearchString]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setUserSearchString(value);
  };

  const handleCloseDialog = () => {
    setShowNewMessageDialog(false);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    const elementParent = event.currentTarget.parentElement;
    const userId = elementParent!.dataset.userid;

    dispatch(removeUserFromConvoUsersArray(userId!));
  };

  return (
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
        <Typography>New Message</Typography>
        <Button
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            paddingTop: '8px',
            '&:hover': { backgroundColor: 'unset' },
          }}
          onClick={handleClickNext}
          disabled={!usersArrayForNewConvoReq.length}
        >
          <Typography
            sx={{
              color: usersArrayForNewConvoReq.length
                ? 'rgb(0, 149, 246)'
                : 'rgba(0,149,246,0.4)',
              textTransform: 'capitalize',
            }}
          >
            Next
          </Typography>
        </Button>
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
  );
};

export default NewConvoDialog;
