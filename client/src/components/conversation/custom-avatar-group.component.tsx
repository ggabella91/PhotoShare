import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarGroup } from '@mui/material';
import Badge from '@mui/material/Badge';
import { getConvoAvatars } from '../../pages/messages-page/messages-page.utils';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import { selectConvoAvatarMap } from '../../redux/post/post.selectors';
import { MessageUser } from '../../redux/message/message.types';

export enum StyleVariation {
  preview = 'preview',
  conversationHeader = 'conversationHeader',
  forwardMessage = 'forwardMessage',
}

interface CustomAvatarGroupProps {
  avatarS3Keys: string[];
  conversationName: string;
  styleVariation: StyleVariation;
  messageUsers?: MessageUser[];
}

const previewStyleObj = { height: '56px', width: '56px' };
const forwardStyleObj = { height: '44px', width: '44px' };
const headerStyleObj = {
  marginLeft: '15px',
  marginRight: '15px',
  height: '24px',
  width: '24px',
};

const CustomAvatarGroup: React.FC<CustomAvatarGroupProps> = ({
  avatarS3Keys,
  conversationName,
  styleVariation,
  messageUsers,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const convoAvatarMap = useSelector(selectConvoAvatarMap);
  const convoAvatarFileStrings = avatarS3Keys?.length
    ? getConvoAvatars(avatarS3Keys, currentUser)?.map(
        (s3Key) => convoAvatarMap.get(s3Key)?.fileString || ''
      )
    : [''];

  const getStyle = () => {
    if (styleVariation === StyleVariation.preview) {
      return previewStyleObj;
    } else if (styleVariation === StyleVariation.conversationHeader) {
      return headerStyleObj;
    } else {
      return forwardStyleObj;
    }
  };

  const renderAvatar = (avatarFileString: string, idx: number) => (
    <Avatar
      src={
        !!avatarFileString ? `data:image/jpeg;base64,${avatarFileString}` : ''
      }
      alt={conversationName}
      key={idx}
      sx={getStyle()}
    />
  );

  if (
    (convoAvatarFileStrings.length === 1 &&
      styleVariation === StyleVariation.conversationHeader) ||
    styleVariation === StyleVariation.preview
  ) {
    const avatarFileString = convoAvatarFileStrings[0];
    const messageUser = messageUsers?.find(
      (user) => user.photoS3Key === avatarS3Keys[0]
    );
    const isOnline = messageUser?.isOnline;

    if (!isOnline) {
      return renderAvatar(avatarFileString, 0);
    }

    return (
      <Badge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant='dot'
        sx={{
          color: '#44b700',
          boxShadow: `0 0 0 2px #ffffff`,
        }}
      >
        {renderAvatar(avatarFileString, 0)}
      </Badge>
    );
  }

  return (
    <>
      <AvatarGroup max={3} spacing='small'>
        {convoAvatarFileStrings.map((avatarFileString, idx) =>
          renderAvatar(avatarFileString, idx)
        )}
      </AvatarGroup>
    </>
  );
};

export default CustomAvatarGroup;
