import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Grid, Typography } from '@mui/material';

import { FileRequestType, UserType } from '../../redux/post/post.types';
import { selectConvoAvatarMap } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import { selectConversationMessages } from '../../redux/message/message.selectors';

interface ConversationPreviewProps {
  conversationName: string;
  conversationId: string;
  avatarS3Key?: string;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  conversationId,
  avatarS3Key,
}) => {
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileString =
    avatarS3Key && convoAvatarMap.get(avatarS3Key)?.fileString;
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

  const handleClick = () => {
    navigate(`/direct/t/${conversationId}`);
  };

  // TODO: Write util function to dynamically calculate elapsed time since last message below

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
      <Avatar
        src={
          !!convoAvatarFileString
            ? `data:image/jpeg;base64,${convoAvatarFileString}`
            : ''
        }
        alt={conversationName}
        sx={{ height: '56px', width: '56px' }}
      />
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: '15px',
        }}
      >
        <Typography>{conversationName}</Typography>
        {!!lastMessage && (
          <Typography>
            {lastMessage.text} ·{' '}
            {lastMessage.created.toString().split(' ').slice(1, 3).join(' ')}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ConversationPreview;
