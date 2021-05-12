import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';

import PostOptionsModal from '../post-or-comment-options-modal/post-or-comment-options-modal.component';

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
  const [
    showCommentOptionsButtonForIdx,
    setShowCommentOptionsButtonForIdx,
  ] = useState({ show: false, idx: -1 });

  let history = useHistory();

  const userInfo = userInfoArray.map(
    (el: UserInfoAndOtherData, idx: number) => (
      <div
        className={`user-${styleType}-element`}
        key={idx}
        onClick={
          styleType === StyleType.suggestion
            ? () => {
                history.push(`/${el.username}`);
              }
            : () => {}
        }
        onMouseEnter={() =>
          setShowCommentOptionsButtonForIdx({ show: true, idx })
        }
        onMouseLeave={() =>
          setShowCommentOptionsButtonForIdx({ show: false, idx })
        }
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
            {styleType !== StyleType.suggestion ? (
              <NavLink
                to={`/${el.username}`}
                className={`${styleType}-username`}
              >
                {el.username}
              </NavLink>
            ) : (
              <span className={`${styleType}-username`}>{el.username}</span>
            )}
            <span className={`${styleType}-name`}>{el.name}</span>
            <span className={`${styleType}-location`}>{el.location}</span>
            <span>{el.comment ? el.comment : null}</span>
          </div>
          {el.commentDate ? (
            <span className={`${styleType}-date`}>
              {new Date(el.commentDate).toDateString()}
            </span>
          ) : null}
        </div>
        <div
          className={`${
            showCommentOptionsButtonForIdx.show &&
            showCommentOptionsButtonForIdx.idx === idx
              ? ''
              : 'hide'
          } comment-options`}
        >
          <span
            className='comment-ellipsis-button'
            onClick={() => {} /*setShowCommentOptionsModal(true)*/}
          >
            ...
          </span>
        </div>
      </div>
    )
  );

  return <div className={`user-${styleType}-container`}>{userInfo}</div>;
};

export default UserInfo;
