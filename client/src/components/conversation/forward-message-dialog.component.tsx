import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Chip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ForwardConvoDetails from './forward-convo-details.component';
import { selectJoinedConversations } from '../../redux/message/message.selectors';

import { Conversation } from '../../redux/message/message.types';

interface ForwardMessageDialogProps {
  showForwardMessageDialog: boolean;
  setShowForwardMessageDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onSendMessage: (conversationId: string) => void;
}

const ForwardMessageDialog: React.FC<ForwardMessageDialogProps> = ({
  showForwardMessageDialog,
  setShowForwardMessageDialog,
  onSendMessage,
}) => {
  const [convoSearchString, setConvoSearchString] = useState('');
  const [convosToReceiveMessage, setConvosToReceiveMessage] = useState<
    Conversation[]
  >([]);
  const joinedConversations = useSelector(selectJoinedConversations);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setConvoSearchString(value);
  };

  const handleCloseDialog = () => {
    setShowForwardMessageDialog(false);
    setConvoSearchString('');
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    const elementParent = event.currentTarget.parentElement;
    const convoId = elementParent!.dataset.convoid;

    const newConvosToReceiveMessage = convosToReceiveMessage.filter(
      (convo) => convo.id !== convoId
    );
    setConvosToReceiveMessage(newConvosToReceiveMessage);
  };

  const handleSendMessage = () => {
    convosToReceiveMessage.forEach((convo) => onSendMessage(convo.id));
    setConvosToReceiveMessage([]);
    setShowForwardMessageDialog(false);
  };

  return (
    <Dialog
      onClose={handleCloseDialog}
      open={showForwardMessageDialog}
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
        <Typography>Forward</Typography>
        <Button
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            paddingTop: '8px',
            '&:hover': { backgroundColor: 'unset' },
          }}
          onClick={handleSendMessage}
          disabled={!convosToReceiveMessage.length}
        >
          <Typography
            sx={{
              color: convosToReceiveMessage.length
                ? 'rgb(0, 149, 246)'
                : 'rgba(0,149,246,0.4)',
              textTransform: 'capitalize',
            }}
          >
            Send
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
          startAdornment: !!convosToReceiveMessage.length && (
            <Grid sx={{ marginRight: '10px', display: 'flex' }}>
              {convosToReceiveMessage.map((convo) => (
                <Chip
                  sx={{
                    color: 'rgb(0, 149, 246)',
                    backgroundColor: 'rgb(224,241,255)',
                    marginRight: '5px',
                  }}
                  label={convo.name}
                  key={convo.id}
                  data-convoid={convo.id}
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
          value: convoSearchString,
        }}
        InputLabelProps={{ sx: { paddingLeft: '15px' } }}
      />
      <Grid sx={{ width: '100%', height: 'auto' }}>
        {joinedConversations
          ?.filter((convo) =>
            convo.name.includes(convoSearchString.toLowerCase())
          )
          .map((conversation) => (
            <ForwardConvoDetails
              key={conversation.id}
              conversation={conversation}
              convosToReceiveMessage={convosToReceiveMessage}
              setConvosToReceiveMessage={setConvosToReceiveMessage}
            />
          ))}
      </Grid>
    </Dialog>
  );
};

export default ForwardMessageDialog;
