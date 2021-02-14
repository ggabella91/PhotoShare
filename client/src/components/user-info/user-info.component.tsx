import React from 'react';
import { useHistory } from 'react-router-dom';

import { UserInfoData } from '../search-bar/search-bar.component';

import './user-info.styles.scss';

interface UserInfoProps {
  userInfoArray: UserInfoData[];
}

export const UserInfo: React.FC<UserInfoProps> = ({ userInfoArray }) => {
  let history = useHistory();
  const suggestions = userInfoArray.map((el: UserInfoData, idx: number) => (
    <div
      className='user-suggestion'
      key={idx}
      onClick={() => {
        history.push(`/${el.username}`);
      }}
    >
      <div className='suggestion-avatar'>
        {el.profilePhotoFileString ? (
          <img
            className='suggestion-profile-photo'
            src={`data:image/jpeg;base64,${el.profilePhotoFileString}`}
            alt='profile-pic'
          />
        ) : null}
        {!el.profilePhotoFileString ? (
          <div className='suggestion-photo-placeholder'>
            <span className='suggestion-photo-placeholder-text'>No photo</span>
          </div>
        ) : null}
      </div>
      <div className='username-and-name'>
        <span className='username'>{el.username}</span>
        <span className='name'>{el.name}</span>
      </div>
    </div>
  ));

  return <div className='user-suggestions-dropdown'>{suggestions}</div>;
};

export default UserInfo;
