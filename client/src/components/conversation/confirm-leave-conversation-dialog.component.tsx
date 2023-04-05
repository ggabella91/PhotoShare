import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
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
        transform: 'translateX(calc(50vw - 50%))',
      }}
      PaperProps={{
        sx: { width: '40vw', maxWidth: '400px', borderRadius: '12px' },
      }}
      onClose={onBlur}
    >
      <DialogTitle></DialogTitle>
      <DialogActions>
        <Button
          onClick={handleCancel}
          sx={{
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLeaveConversation}
          sx={{
            '&:hover': {
              backgroundColor: 'unset',
            },
          }}
        >
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLeaveConversationDialog;
