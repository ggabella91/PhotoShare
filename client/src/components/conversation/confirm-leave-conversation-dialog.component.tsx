import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
} from '@mui/material';

interface ConfirmLeaveConversationDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBlur: () => void;
  handleLeaveConversation: () => void;
}

const ConfirmLeaveConversationDialog: React.FC<
  ConfirmLeaveConversationDialogProps
> = ({ open, setOpen, onBlur, handleLeaveConversation }) => {
  const handleCancel = () => setOpen(false);
  return (
    <Dialog
      open={open}
      sx={{
        display: 'flex',
      }}
      PaperProps={{
        sx: {
          width: '40vw',
          maxWidth: '400px',
          borderRadius: '12px',
          transform: 'translateX(calc(50vw - 50%))',
        },
      }}
      onClose={onBlur}
    >
      <DialogTitle>
        Are you sure you want to leave this conversation?
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={handleCancel}
          sx={{
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          <Typography sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleLeaveConversation}
          sx={{
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          <Typography
            sx={{ textTransform: 'capitalize', color: 'red', fontWeight: 500 }}
          >
            Leave
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLeaveConversationDialog;
