import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Grid, Typography } from '@mui/material';
import { calculateElapsedTime } from './conversation.utils';

import { FileRequestType, UserType } from '../../redux/post/post.types';
import { selectConvoAvatarMap } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import { selectConversationMessages } from '../../redux/message/message.selectors';

interface ConversationPreviewProps {
  conversationName: string;
  conversationId: string;
  avatarS3Keys?: string[];
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  conversationId,
  avatarS3Keys,
}) => {
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileString =
    avatarS3Keys?.length && convoAvatarMap.get(avatarS3Keys[0])?.fileString;
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
    if (avatarS3Keys) {
      dispatch(
        getPostFileStart({
          s3Key: avatarS3Keys[0],
          bucket,
          fileRequestType: FileRequestType.singlePost,
          user: UserType.conversationAvatar,
        })
      );
    }
  }, [avatarS3Keys]);

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
