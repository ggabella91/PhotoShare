import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Grid, Typography } from '@mui/material';

import { FileRequestType, UserType } from '../../redux/post/post.types';
import { selectConvoAvatarMap } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

interface ConversationPreviewProps {
  conversationName: string;
  avatarS3Key?: string;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  avatarS3Key,
}) => {
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileString =
    avatarS3Key && convoAvatarMap.get(avatarS3Key)?.fileString;
  const dispatch = useDispatch();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (avatarS3Key) {
      dispatch(
        getPostFileStart({
          s3Key: avatarS3Key,
          bucket,
          fileRequestType: FileRequestType.singlePost,
          user: UserType.conversationAvatar,
        })
      );
    }
  }, [avatarS3Key]);

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        height: '72px',
        padding: '8px',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Avatar
        src={
          !!convoAvatarFileString
            ? `data:image/jpeg;base64,${convoAvatarFileString}`
            : ''
        }
        alt={conversationName}
        sx={{ height: '56px', width: '56px' }}
      />
      <Grid sx={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
        <Typography>{conversationName}</Typography>
      </Grid>
    </Grid>
  );
};

export default ConversationPreview;
