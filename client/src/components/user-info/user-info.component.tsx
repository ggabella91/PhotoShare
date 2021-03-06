import React from 'react';
import { useHistory } from 'react-router-dom';

import { UserInfoData } from '../search-bar/search-bar.component';

import './user-info.styles.scss';

export enum StyleType {
  suggestion = 'suggestion',
  modal = 'modal',
  feed = 'feed',
}

interface UserInfoProps {
  styleType: StyleType;
  userInfoArray: UserInfoData[];
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userInfoArray,
  styleType,
}) => {
  let history = useHistory();
  const userInfo = userInfoArray.map((el: UserInfoData, idx: number) => (
    <div
      className={`user-${styleType}-element`}
      key={idx}
      onClick={() => {
        history.push(`/${el.username}`);
      }}
    >
      <div className={`${styleType}-avatar`}>
        {el.profilePhotoFileString ? (
          <img
            className={`${styleType}-profile-photo`}
            src={`data:image/jpeg;base64,${el.profilePhotoFileString}`}
            alt='profile-pic'
          />
        ) : null}
        {!el.profilePhotoFileString ? (
          <div className={`${styleType}-photo-placeholder`}>
            <span className={`${styleType}-photo-placeholder-text`}>
              No photo
            </span>
          </div>
        ) : null}
      </div>
      <div className={`${styleType}-username-and-name`}>
        <span className={`${styleType}-username`}>{el.username}</span>
        <span className={`${styleType}-name`}>{el.name}</span>
      </div>
    </div>
  ));

  return <div className={`user-${styleType}-container`}>{userInfo}</div>;
};

export default UserInfo;
