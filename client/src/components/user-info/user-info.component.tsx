import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { Location } from '../../redux/post/post.types';

import {
  setCommentToDelete,
  setShowCommentOptionsModal,
  setShowPostEditForm,
  setFeedPagePostOptionsModalShow,
  setFeedPagePostIdForNavigation,
} from '../../redux/post/post.actions';

import './user-info.styles.scss';

export enum StyleType {
  suggestion = 'suggestion',
  modal = 'modal',
  feed = 'feed',
  comment = 'comment',
  postPage = 'post-page',
  chatSuggestion = 'chat-suggestion',
}

export interface UserInfoAndOtherData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  location: Location;
  comment: string;
  commentDate?: Date | string;
  reactionId?: string;
  reactingUserId?: string;
  postId?: string;
  isVideo?: boolean;
}

interface UserInfoProps {
  styleType: StyleType;
  userInfoArray: UserInfoAndOtherData[];
  isCaption?: boolean;
  isCaptionOwner?: boolean;
  selectedSuggestion?: number | null;
  shouldNavigate?: boolean;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  userInfoArray,
  styleType,
  isCaption,
  isCaptionOwner,
  selectedSuggestion,
  shouldNavigate,
}) => {
  const [showCommentOptionsButtonForIdx, setShowCommentOptionsButtonForIdx] =
    useState({ show: false, idx: -1 });

  let navigate = useNavigate();

  const dispatch = useDispatch();

  const handleClickComponent = (event: React.MouseEvent<HTMLElement>) => {
    const divElement = event.currentTarget;
    const username = divElement.dataset.username;

    if (styleType === StyleType.suggestion) {
      navigate(`/${username}`);
    }
  };

  const handleOnMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    const divElement = event.currentTarget;
    const idx = parseInt(divElement.dataset.idx || '0');

    setShowCommentOptionsButtonForIdx({ show: true, idx });
  };

  const handleOnMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    const divElement = event.currentTarget;
    const idx = parseInt(divElement.dataset.idx || '0');

    setShowCommentOptionsButtonForIdx({ show: false, idx });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (styleType === StyleType.suggestion) {
      event.preventDefault();
    }
  };

  const handleSetCommentToDelete = (event: React.MouseEvent<HTMLElement>) => {
    const spanElement = event.currentTarget;
    let idx = parseInt(spanElement.dataset.idx || '0');

    if (typeof idx !== 'number') {
      idx = -1;
    }

    const commentToDelete: UserInfoAndOtherData = userInfoArray[idx]!;

    if (commentToDelete.reactionId && commentToDelete.reactingUserId) {
      dispatch(
        setCommentToDelete({
          reactionId: commentToDelete.reactionId,
          isLikeRemoval: false,
          reactingUserId: commentToDelete.reactingUserId,
          postId: commentToDelete.postId || '',
        })
      );

      dispatch(setShowCommentOptionsModal(true));
    }
  };

  const handleClickCaptionOptions = () => {
    if (isCaptionOwner) {
      dispatch(setShowPostEditForm(true));
    }
  };

  const handleSetFeedPagePostOptionsModalShow = () => {
    dispatch(setFeedPagePostOptionsModalShow(true));
    if (userInfoArray[0] && userInfoArray[0]!.postId) {
      dispatch(setFeedPagePostIdForNavigation(userInfoArray[0]!.postId!));
    }
  };

  const handleRenderCaptionWithHashtagLinks = (caption: string) => {
    const captionWithHashtagLinks = caption.split(' ').map((word) => {
      if (word.indexOf('#') === 0) {
        return (
          <NavLink
            to={`/explore/tags/${word.substring(1).toLowerCase()}`}
            className='hashtag'
          >
            {word}
          </NavLink>
        );
      } else {
        return <>{word}</>;
      }
    });

    return (
      <>
        {captionWithHashtagLinks.reduce(
          (acc: JSX.Element | null, val) =>
            acc === null ? (
              val
            ) : (
              <>
                {acc} {val}
              </>
            ),
          null
        )}
      </>
    );
  };

  useEffect(() => {
    if (
      styleType === StyleType.suggestion &&
      typeof selectedSuggestion === 'number' &&
      shouldNavigate
    ) {
      const userProfile = userInfoArray.find(
        (_, idx) => idx === selectedSuggestion
      );

      if (userProfile) {
        const username = userProfile.username;
        navigate(`/${username}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSuggestion, shouldNavigate]);

  const userInfo = userInfoArray.map(
    (el: UserInfoAndOtherData, idx: number) => (
      <div
        className='user-and-options'
        key={idx}
        data-idx={idx}
        data-username={el.username}
        data-testid={`user-${styleType}-element-${idx}`}
        onClick={handleClickComponent}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`user-${styleType}-element${
            selectedSuggestion === idx ? ' selected' : ''
          }`}
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
                <p className={`${styleType}-photo-placeholder-text`}>
                  No photo
                </p>
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
              <span className={`${styleType}-location`}>
                {el.location?.label || ''}
              </span>
              <span>
                {el.comment
                  ? isCaption
                    ? handleRenderCaptionWithHashtagLinks(el.comment)
                    : el.comment
                  : null}
              </span>
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
            } ${styleType}-options`}
          >
            {(styleType === StyleType.comment ||
              styleType === StyleType.postPage) &&
            !isCaption ? (
              <button
                className={`${styleType}-ellipsis-button`}
                data-idx={idx}
                onClick={handleSetCommentToDelete}
                data-testid='comment-ellipsis-button'
              >
                <MoreHorizIcon />
              </button>
            ) : null}
            {(styleType === StyleType.comment ||
              styleType === StyleType.postPage) &&
            isCaption ? (
              <button
                className={`${styleType}-ellipsis-button`}
                onClick={handleClickCaptionOptions}
                data-testid='caption-ellipsis-button'
              >
                <MoreHorizIcon />
              </button>
            ) : null}
          </div>
        </div>
        {styleType === StyleType.feed ? (
          <button
            className='post-options'
            onClick={handleSetFeedPagePostOptionsModalShow}
            data-testid='post-ellipsis-button'
          >
            <MoreHorizIcon className='ellipsis' />
          </button>
        ) : null}
      </div>
    )
  );

  return (
    <div
      className={`user-${styleType}-container`}
      data-testid={`user-${styleType}-container`}
    >
      {userInfo}
    </div>
  );
};

export default UserInfo;
