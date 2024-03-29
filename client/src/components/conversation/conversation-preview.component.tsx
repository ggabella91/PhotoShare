import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { renderElapsedTime } from './conversation.utils';
import CustomAvatarGroup, {
  StyleVariation,
} from './custom-avatar-group.component';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import { FileRequestType, UserType } from '../../redux/post/post.types';

import { getPostFileStart } from '../../redux/post/post.actions';

import {
  selectConversationMessages,
  selectConversationMessageUsersMap,
} from '../../redux/message/message.selectors';
import { getConversationUsersStart } from '../../redux/message/message.actions';

interface ConversationPreviewProps {
  conversationName: string;
  conversationId: string;
  avatarS3Keys: string[];
  setIsInfoClicked: React.Dispatch<React.SetStateAction<boolean>>;
  conversationImageS3Key?: string;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversationName,
  conversationId,
  avatarS3Keys,
  setIsInfoClicked,
  conversationImageS3Key,
}) => {
  const conversationMessages = useSelector(selectConversationMessages);
  const currentUser = useSelector(selectCurrentUser);
  const conversationMessageUsersMap = useSelector(
    selectConversationMessageUsersMap
  );
  const conversationMessageUsers =
    conversationMessageUsersMap && conversationMessageUsersMap[conversationId];
  const lastMessage = conversationMessages.find(
    (convoMessage) => convoMessage.conversationId === conversationId
  )?.messages[0];
  const isCurrentUserMessageOwner =
    currentUser && lastMessage?.ownerId === currentUser.id;

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
    dispatch(getConversationUsersStart(conversationId));
  }, [dispatch, conversationId]);

  useEffect(() => {
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

    if (conversationImageS3Key) {
      dispatch(
        getPostFileStart({
          s3Key: conversationImageS3Key,
          bucket: conversationBucket,
          fileRequestType: FileRequestType.singlePost,
          user: UserType.conversationImage,
        })
      );
    }
  }, [
    dispatch,
    bucket,
    conversationBucket,
    avatarS3Keys,
    conversationImageS3Key,
  ]);

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
        messageUsers={conversationMessageUsers}
        conversationImageS3Key={conversationImageS3Key}
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
            {lastMessage.hidden
              ? isCurrentUserMessageOwner
                ? 'You unsent a message'
                : 'Message unsent by owner'
              : lastMessage.text}{' '}
            · {renderElapsedTime(lastMessage.created)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ConversationPreview;
