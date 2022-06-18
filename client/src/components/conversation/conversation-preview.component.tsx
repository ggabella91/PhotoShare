import { Avatar, Grid, Typography } from '@mui/material';
import React from 'react';

interface ConversationPreviewProps {
  conversationName: string;
  avatarPhotoFileString?: string;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  avatarPhotoFileString,
}) => {
  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        height: '72px',
      }}
    >
      <Avatar
        src={
          !!avatarPhotoFileString
            ? `data:image/jpeg;base64,${avatarPhotoFileString}`
            : ''
        }
        alt={conversationName}
        sx={{ height: '56px', width: '56px' }}
      />
      <Typography>{conversationName}</Typography>
    </Grid>
  );
};

export default ConversationPreview;
