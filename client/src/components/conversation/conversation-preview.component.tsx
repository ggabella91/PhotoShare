import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarGroup, Grid, Typography } from '@mui/material';
import { calculateElapsedTime } from './conversation.utils';
import { getConvoAvatars } from '../../pages/messages-page/messages-page.utils';

import { selectCurrentUser } from '../../redux/user/user.selectors';

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
  const currentUser = useSelector(selectCurrentUser);
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileStrings = avatarS3Keys?.length
    ? getConvoAvatars(avatarS3Keys, currentUser)?.map(
        (s3Key) => convoAvatarMap.get(s3Key)?.fileString || ''
      )
    : [''];
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
      <AvatarGroup max={3} spacing='small'>
        {convoAvatarFileStrings.map((avatarFileString) => (
          <Avatar
            src={
              !!avatarFileString
                ? `data:image/jpeg;base64,${avatarFileString}`
                : ''
            }
            alt={conversationName}
            sx={{ height: '56px', width: '56px' }}
          />
        ))}
      </AvatarGroup>
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
