import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import { DeleteReactionReq } from '../../redux/post/post.types';

import {
  setCommentToDelete,
  setShowCommentOptionsModal,
  setShowPostEditForm,
} from '../../redux/post/post.actions';

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
  commentDate?: Date | string;
  reactionId?: string;
  reactingUserId?: string;
}

interface UserInfoProps {
  styleType: StyleType;
  userInfoArray: UserInfoAndOtherData[];
  isCaption?: boolean;
  isCaptionOwner?: boolean;
  setCommentToDelete: typeof setCommentToDelete;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  setShowPostEditForm: typeof setShowPostEditForm;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userInfoArray,
  styleType,
  isCaption,
  isCaptionOwner,
  setCommentToDelete,
  setShowCommentOptionsModal,
  setShowPostEditForm,
}) => {
  const [showCommentOptionsButtonForIdx, setShowCommentOptionsButtonForIdx] =
    useState({ show: false, idx: -1 });

  let history = useHistory();

  const handleSetCommentToDelete = (idx: number) => {
    const commentToDelete = userInfoArray[idx];
    if (commentToDelete.reactionId && commentToDelete.reactingUserId) {
      setCommentToDelete({
        reactionId: commentToDelete.reactionId,
        isLikeRemoval: false,
        reactingUserId: commentToDelete.reactingUserId,
      });

      setShowCommentOptionsModal(true);
    }
  };

  const handleClickCaptionOptions = () => {
    if (isCaptionOwner) {
      setShowPostEditForm(true);
    }
  };

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
          {styleType === StyleType.comment && !isCaption ? (
            <span
              className='comment-ellipsis-button'
              onClick={() => handleSetCommentToDelete(idx)}
            >
              ...
            </span>
          ) : null}
          {styleType === StyleType.comment && isCaption ? (
            <span
              className='comment-ellipsis-button'
              onClick={handleClickCaptionOptions}
            >
              ...
            </span>
          ) : null}
        </div>
      </div>
    )
  );

  return <div className={`user-${styleType}-container`}>{userInfo}</div>;
};

interface LinkStateProps {}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCommentToDelete: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(setCommentToDelete(deleteReactionReq)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  setShowPostEditForm: (showPostEditForm: boolean) =>
    dispatch(setShowPostEditForm(showPostEditForm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
