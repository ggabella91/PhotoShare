import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectPostReactingUsers,
} from '../../redux/user/user.selectors';

import {
  Reaction,
  ReactionReq,
  PostError,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
  deleteReactionStart,
} from '../../redux/post/post.actions';

import Button from '../button/button.component';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  caption?: string;
  date: string;
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  deleteReactionStart: typeof deleteReactionStart;
  custRef?: (node: HTMLDivElement | null) => void;
  key: number;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  userId: string;
  username: string;
  postId: string;
  location: string;
  name: string;
  comment: string;
}

export const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  fileString,
  caption,
  date,
  currentUser,
  custRef,
}) => {
  const [alreadyLikedPost, setAlreadyLikedPost] = useState(false);

  const handleRenderLikedOrLikedButton = () => {
    return (
      <Button
        className='like-text-button'
        onClick={
          alreadyLikedPost
            ? () => handleSubmitRemoveLike()
            : () => handleSubmitLike()
        }
      >
        <span>{alreadyLikedPost ? 'Liked' : 'Like'}</span>
      </Button>
    );
  };

  const handleSubmitLike = () => {
    createPostReactionStart({
      reactingUserId: userInfo.userId,
      postId: userInfo.postId,
      likedPost: true,
      comment: '',
    });
  };

  const handleSubmitRemoveLike = () => {
    deleteReactionStart({
      reactingUserId: currentUser!.id,
      reactionId: '',
      isLikeRemoval: true,
    });
  };

  return (
    <div className='feed-post-container' ref={custRef}>
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[userInfo]} />
      </div>
      <div className='image-background'>
        <img
          className='feed-post-photo'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='user'
        />
      </div>
      <div className='caption-and-reactions'>
        <div className='caption'>
          <span className='username'>{userInfo.username}</span>{' '}
          {caption ? caption : ''}
        </div>
        {handleRenderLikedOrLikedButton()}
        <span className='date'>{date}</span>
      </div>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postReactionsArray: selectPostReactionsArray,
  postReactionConfirm: selectPostReactionConfirm,
  postReactionError: selectPostReactionError,
  getPostReactionsConfirm: selectGetPostReactionsConfirm,
  getPostReactionsError: selectGetPostReactionsError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostReactionStart: (reactionReq: ReactionReq) =>
    dispatch(createPostReactionStart(reactionReq)),
  getPostReactionsStart: (postId: string) =>
    dispatch(getPostReactionsStart(postId)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPostContainer);
