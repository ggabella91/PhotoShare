import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { OptionsDialogUser } from './conversation.component';

interface SetConvoUserNicknameDialogProps {
  open: boolean;
  onClose: () => void;
  optionsDialogUser: OptionsDialogUser;
  setOptionsDialogUser: React.Dispatch<React.SetStateAction<OptionsDialogUser>>;
  handleSubmitNewNickname: () => void;
  convoUserNicknameMap: Record<string, string>;
}

const SetConvoUserNicknameDialog: React.FC<SetConvoUserNicknameDialogProps> = ({
  open,
  onClose,
  optionsDialogUser,
  setOptionsDialogUser,
  handleSubmitNewNickname,
  convoUserNicknameMap,
}) => {
  const [showNicknameDone, setShowNicknameDone] = useState(false);

  useEffect(() => {
    const nickname = optionsDialogUser.nickname;
    const userId = optionsDialogUser.userId;

    if (nickname) {
      setShowNicknameDone(
        !!(
          nickname?.length &&
          convoUserNicknameMap &&
          nickname !== convoUserNicknameMap[userId]
        )
      );
    } else if (convoUserNicknameMap[userId]) {
      setShowNicknameDone(false);
    }
  }, [optionsDialogUser, convoUserNicknameMap]);

  const handleNicknameChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setOptionsDialogUser({ ...optionsDialogUser, nickname: value });
  };

  const handleSubmitNewNicknameEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitNewNickname();
    }
  };

  return (
    <Dialog
      open={open}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(calc(50vw - 50%))',
      }}
      PaperProps={{
        sx: { width: '40vw', maxWidth: '300px', borderRadius: '12px' },
      }}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 12px',
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Set Nickname
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 5,
            top: 5,
            color: 'rgb(219,219,219)',
          }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '10px 12px' }}>
        <TextField
          sx={{
            input: {
              padding: '0px 8px',
            },
          }}
          label=''
          placeholder='Add a name'
          fullWidth
          value={optionsDialogUser.nickname}
          onChange={handleNicknameChange}
          onKeyDown={handleSubmitNewNicknameEnterKey}
          InputProps={{
            endAdornment: showNicknameDone && (
              <InputAdornment
                position='end'
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '35px',
                }}
              >
                <Button
                  variant='text'
                  size='small'
                  onClick={handleSubmitNewNickname}
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
              padding: '0px 8px 0px 0px',
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SetConvoUserNicknameDialog;
