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
  conversationImageS3Key?: string;
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
  conversationImageS3Key,
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

  const getStyle = (isGroupAvatar?: boolean, idx?: number) => {
    if (styleVariation === StyleVariation.preview) {
      return {
        ...previewStyleObj,
        ...(isGroupAvatar && {
          height: '34px',
          width: '34px',
          transform: 'rotate(330deg)',
        }),
      };
    } else if (styleVariation === StyleVariation.conversationHeader) {
      return {
        ...headerStyleObj,
        ...(isGroupAvatar && { transform: 'rotate(330deg)' }),
        marginLeft: isGroupAvatar && idx === 1 ? '-26px !important' : 'unset',
      };
    } else {
      return forwardStyleObj;
    }
  };

  const renderAvatar = (
    avatarFileString: string,
    idx: number,
    isGroupAvatar?: boolean
  ) => (
    <Avatar
      src={
        !!avatarFileString ? `data:image/jpeg;base64,${avatarFileString}` : ''
      }
      alt={conversationName}
      key={idx}
      sx={getStyle(isGroupAvatar, idx)}
    />
  );

  if (
    convoAvatarFileStrings.length === 1 &&
    styleVariation === StyleVariation.conversationHeader
  ) {
    const avatarFileString = convoAvatarFileStrings[0];
    const messageUser = messageUsers?.find(
      (user) => user.photoS3Key !== currentUser?.photo
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
          '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 3px #ffffff`,
            width: '15px',
            height: '15px',
            borderRadius: '50%',
          },
        }}
      >
        {renderAvatar(avatarFileString, 0)}
      </Badge>
    );
  }

  const rotateGroup = convoAvatarFileStrings.length > 1;

  return (
    <>
      <AvatarGroup
        max={2}
        spacing='small'
        sx={{
          transform: rotateGroup ? 'rotate(30deg)' : 'unset',
        }}
      >
        {convoAvatarFileStrings.map((avatarFileString, idx) =>
          renderAvatar(
            avatarFileString,
            idx,
            convoAvatarFileStrings.length > 1 && true
          )
        )}
      </AvatarGroup>
    </>
  );
};

export default CustomAvatarGroup;
