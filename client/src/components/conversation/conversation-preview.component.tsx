import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { calculateElapsedTime } from './conversation.utils';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';

import { FileRequestType, UserType } from '../../redux/post/post.types';

import { getPostFileStart } from '../../redux/post/post.actions';

import { selectConversationMessages } from '../../redux/message/message.selectors';

interface ConversationPreviewProps {
  conversationName: string;
  conversationId: string;
  avatarS3Keys: string[];
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  conversationId,
  avatarS3Keys,
}) => {
  const conversationMessages = useSelector(selectConversationMessages);
  const lastMessage = conversationMessages
    .find((convoMessage) => convoMessage.conversationId === conversationId)
    ?.messages.at(-1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (avatarS3Keys?.length) {
      avatarS3Keys.forEach((s3Key) => {
        dispatch(
          getPostFileStart({
            s3Key,
            bucket,
            fileRequestType: FileRequestType.singlePost,
            user: UserType.conversationAvatar,
          })
        );
      });
    }
  }, [dispatch, bucket, avatarS3Keys]);

  const handleClick = () => {
    navigate(`/direct/t/${conversationId}`);
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        height: '72px',
        padding: '8px 20px',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
      onClick={handleClick}
    >
      <CustomAvatarGroup
        conversationName={conversationName}
        avatarS3Keys={avatarS3Keys}
        styleVariation={StyleVariation.preview}
      />
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: '15px',
          textAlign: 'initial',
        }}
      >
        <Typography>{conversationName}</Typography>
        {!!lastMessage && (
          <Typography sx={{ fontSize: '14px' }}>
            {lastMessage.text} · {calculateElapsedTime(lastMessage.created)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ConversationPreview;
