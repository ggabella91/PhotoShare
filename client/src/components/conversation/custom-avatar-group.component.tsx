import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarGroup } from '@mui/material';
import { getConvoAvatars } from '../../pages/messages-page/messages-page.utils';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import { selectConvoAvatarMap } from '../../redux/post/post.selectors';

export enum StyleVariation {
  preview = 'preview',
  conversationHeader = 'conversationHeader',
  forwardMessage = 'forwardMessage',
}

interface CustomAvatarGroupProps {
  avatarS3Keys: string[];
  conversationName: string;
  styleVariation: StyleVariation;
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

  return (
    <>
      <AvatarGroup max={3} spacing='small'>
        {convoAvatarFileStrings.map((avatarFileString, idx) => (
          <Avatar
            src={
              !!avatarFileString
                ? `data:image/jpeg;base64,${avatarFileString}`
                : ''
            }
            alt={conversationName}
            key={idx}
            sx={getStyle()}
          />
        ))}
      </AvatarGroup>
    </>
  );
};

export default CustomAvatarGroup;
