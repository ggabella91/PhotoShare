import React from 'react';
import { useHistory } from 'react-router-dom';

import './user-info.styles.scss';

export enum StyleType {
  suggestion = 'suggestion',
  modal = 'modal',
  feed = 'feed',
}

export interface UserInfoAndPostLocationData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: string;
}

interface UserInfoProps {
  styleType: StyleType;
  userInfoArray: UserInfoAndPostLocationData[];
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userInfoArray,
  styleType,
}) => {
  let history = useHistory();
  const userInfo = userInfoArray.map(
    (el: UserInfoAndPostLocationData, idx: number) => (
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
        <div className={`${styleType}-username-and-name-or-location`}>
          <span className={`${styleType}-username`}>{el.username}</span>
          <span className={`${styleType}-name`}>{el.name}</span>
          <span className={`${styleType}-location`}>{el.location}</span>
        </div>
      </div>
    )
  );

  return <div className={`user-${styleType}-container`}>{userInfo}</div>;
};

export default UserInfo;
