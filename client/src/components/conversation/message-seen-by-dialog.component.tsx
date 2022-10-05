import React from 'react';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MessageSeenByUser } from './conversation.component';

interface SetConvoUserNicknameDialogProps {
  open: boolean;
  onClose: () => void;
  messageSeenByUsers: MessageSeenByUser;
}

const SetConvoUserNicknameDialog: React.FC<SetConvoUserNicknameDialogProps> = ({
  open,
  onClose,
  messageSeenByUsers,
}) => {
  return (
    <Dialog
      open={open}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        transform: 'translateX(calc(50vw - 50%))',
      }}
      PaperProps={{
        sx: { width: '40vw', maxWidth: '548px', borderRadius: '12px' },
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
        Message seen by
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
        <Grid>{/* TODO Render users */}</Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SetConvoUserNicknameDialog;
