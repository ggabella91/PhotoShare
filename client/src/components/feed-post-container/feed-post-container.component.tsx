import React from 'react';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  caption?: string;
  date: string;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  location: string;
  name: string;
}

const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  fileString,
  caption,
  date,
}) => {
  return (
    <div className='feed-post-container'>
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[userInfo]} />
      </div>
      <img
        className='feed-post-photo'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='user'
      />
      <div className='caption-and-reactions'>
        <div className='caption'>
          <span className='username'>{userInfo.username}</span>{' '}
          {caption ? caption : ''}
          <span className='date'>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedPostContainer;
