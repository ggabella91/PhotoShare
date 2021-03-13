import React from 'react';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  location: string;
}

const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  fileString,
}) => {
  return (
    <div className='feed-post-container'>
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[userInfo]} />
      </div>
      <div className='feed-post-photo'>
        <img
          className='post-modal-image-large'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='user'
        />
      </div>
      <div className='likes-and-comments'></div>
    </div>
  );
};

export default FeedPostContainer;
