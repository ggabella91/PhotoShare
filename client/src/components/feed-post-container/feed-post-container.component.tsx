import React from 'react';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';
import { userInfo } from 'os';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string;
}

const FeedPostContainer: React.FC<FeedPostContainerProps> = () => {
  return (
    <div className='feed-post-container'>
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[]} />
      </div>
      <div className='post-photo'></div>
      <div className='likes-and-comments'></div>
    </div>
  );
};

export default FeedPostContainer;
