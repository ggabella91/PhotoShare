import { Grid, Typography } from '@mui/material';
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
    <Grid sx={{ width: '100%', height: '80px' }}>
      <Typography>{conversationName}</Typography>
    </Grid>
  );
};

export default ConversationPreview;
