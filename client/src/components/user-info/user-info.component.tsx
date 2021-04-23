import React from 'react';
import { useHistory } from 'react-router-dom';

import './user-info.styles.scss';

export enum StyleType {
  suggestion = 'suggestion',
  modal = 'modal',
  feed = 'feed',
  comment = 'comment',
}

export interface UserInfoAndOtherData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  location: string;
  comment: string;
  commentDate?: Date;
}

interface UserInfoProps {
  styleType: StyleType;
  userInfoArray: UserInfoAndOtherData[];
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userInfoArray,
  styleType,
}) => {
  let history = useHistory();

  const userInfo = userInfoArray.map(
    (el: UserInfoAndOtherData, idx: number) => (
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
        <div className='user-data-and-date'>
          <div className={`${styleType}-username-and-other-data`}>
            <span className={`${styleType}-username`}>{el.username}</span>
            <span className={`${styleType}-name`}>{el.name}</span>
            <span className={`${styleType}-location`}>{el.location}</span>
            <span className={`${styleType}-text`}>{el.comment}</span>
          </div>
          {el.commentDate ? (
            <span className={`${styleType}-date`}>
              {new Date(el.commentDate).toDateString()}
            </span>
          ) : null}
        </div>
      </div>
    )
  );

  return <div className={`user-${styleType}-container`}>{userInfo}</div>;
};

export default UserInfo;
