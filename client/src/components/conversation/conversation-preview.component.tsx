import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { renderElapsedTime } from './conversation.utils';
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
  setIsInfoClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  conversationId,
  avatarS3Keys,
  setIsInfoClicked,
}) => {
  const conversationMessages = useSelector(selectConversationMessages);
  const lastMessage = conversationMessages
    .find((convoMessage) => convoMessage.conversationId === conversationId)
    ?.messages.at(-1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let bucket: string;
  let conversationBucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
    conversationBucket = 'photo-share-app-conversation-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
    conversationBucket = 'photo-share-app-conversation-photos-dev';
  }

  useEffect(() => {
    if (avatarS3Keys?.length > 1) {
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
    } else {
      dispatch(
        getPostFileStart({
          s3Key: avatarS3Keys[0],
          bucket: conversationBucket,
          fileRequestType: FileRequestType.singlePost,
          user: UserType.conversationAvatar,
        })
      );
    }
  }, [dispatch, bucket, avatarS3Keys]);

  const handleClick = () => {
    setIsInfoClicked(false);
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
            {lastMessage.text} · {renderElapsedTime(lastMessage.created)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ConversationPreview;
