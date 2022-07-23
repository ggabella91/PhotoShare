import React from 'react';
import { Grid, Typography, Button, Dialog } from '@mui/material';

interface ConversationUserOptionsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBlur: () => void;
  userId: string;
  isAdmin: boolean;
  handleRemoveFromGroup: (userId: string) => void;
  handleAddOrRemoveAsAdmin: (isAdmin: boolean, userId: string) => void;
}

const ConversationUserOptionsDialog: React.FC<
  ConversationUserOptionsDialogProps
> = ({
  open,
  setOpen,
  onBlur,
  userId,
  isAdmin,
  handleRemoveFromGroup,
  handleAddOrRemoveAsAdmin,
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
        sx: { width: '40vw', maxWidth: '400px', borderRadius: '12px' },
      }}
      onClose={onBlur}
    >
      <Grid>
        <Button
          sx={{
            width: '100%',
            height: '48px',
            borderBottom: '1px solid #DBDBDB',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
          onClick={() => handleRemoveFromGroup(userId)}
        >
          <Typography
            sx={{
              color: '#ED4956',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Remove From Group
          </Typography>
        </Button>
      </Grid>
      <Grid>
        <Button
          sx={{
            width: '100%',
            height: '48px',
            borderBottom: '1px solid #DBDBDB',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
          onClick={() => handleAddOrRemoveAsAdmin(isAdmin, userId)}
        >
          <Typography sx={{ color: 'black', textTransform: 'none' }}>
            {isAdmin ? 'Remove as admin' : 'Make Admin'}
          </Typography>
        </Button>
      </Grid>
      <Grid>
        <Button
          sx={{
            width: '100%',
            height: '48px',
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
          onClick={() => setOpen(false)}
        >
          <Typography sx={{ color: 'black', textTransform: 'none' }}>
            Cancel
          </Typography>
        </Button>
      </Grid>
    </Dialog>
  );
};

export default ConversationUserOptionsDialog;