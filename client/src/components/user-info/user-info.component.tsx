import React from 'react';
import { useHistory } from 'react-router-dom';

import { UserInfoData } from '../search-bar/search-bar.component';

import './user-info.styles.scss';

export enum StyleType {
  SEARCH = 'SEARCH',
  MODAL = 'MODAL',
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
      className={
        styleType === StyleType.SEARCH ? 'user-suggestion' : 'user-info-element'
      }
      key={idx}
      onClick={() => {
        history.push(`/${el.username}`);
      }}
    >
      <div
        className={
          styleType === StyleType.SEARCH ? 'suggestion-avatar' : 'modal-avatar'
        }
      >
        {el.profilePhotoFileString ? (
          <img
            className={
              styleType === StyleType.SEARCH
                ? 'suggestion-profile-photo'
                : 'modal-profile-photo'
            }
            src={`data:image/jpeg;base64,${el.profilePhotoFileString}`}
            alt='profile-pic'
          />
        ) : null}
        {!el.profilePhotoFileString ? (
          <div
            className={
              styleType === StyleType.SEARCH
                ? 'suggestion-photo-placeholder'
                : 'modal-photo-placeholder'
            }
          >
            <span
              className={
                styleType === StyleType.SEARCH
                  ? 'suggestion-photo-placeholder-text'
                  : 'modal-photo-placeholder-text'
              }
            >
              No photo
            </span>
          </div>
        ) : null}
      </div>
      <div
        className={
          styleType === StyleType.SEARCH
            ? 'username-and-name'
            : 'modal-username-and-name'
        }
      >
        <span
          className={
            styleType === StyleType.SEARCH ? 'username' : 'modal-username'
          }
        >
          {el.username}
        </span>
        <span
          className={styleType === StyleType.SEARCH ? 'name' : 'modal-name'}
        >
          {el.name}
        </span>
      </div>
    </div>
  ));

  return (
    <div
      className={
        styleType === StyleType.SEARCH
          ? 'user-suggestions-dropdown'
          : 'users-modal-body'
      }
    >
      {userInfo}
    </div>
  );
};

export default UserInfo;
