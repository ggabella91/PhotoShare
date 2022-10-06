import React from 'react';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MessageSeenByUser } from './conversation.component';
import { renderTimeStamp } from './conversation.utils';

interface MessageSeenByUsersDialogProps {
  open: boolean;
  onClose: () => void;
  messageSeenByUsers: MessageSeenByUser[];
}

const MessageSeenByUsersDialog: React.FC<MessageSeenByUsersDialogProps> = ({
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
          fontSize: '18px',
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
        <Grid>
          {messageSeenByUsers?.map((user, idx) => (
            <Grid sx={{ display: 'flex', height: '64px' }} key={idx}>
              <Grid
                sx={{ display: 'flex', marginRight: 2, alignItems: 'center' }}
              >
                <Avatar
                  src={`data:image/jpeg;base64,${user.avatarFileString}`}
                  alt={user.userNameOrNickname}
                  sx={{ width: 40, height: 40 }}
                />
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {user.userNameOrNickname}
                </Typography>
                <Typography>{renderTimeStamp(user.seenTime)}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSeenByUsersDialog;
