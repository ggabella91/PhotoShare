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
  PostFile,
  PostError,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
  selectDeleteReactionConfirm,
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
  deleteReactionStart,
} from '../../redux/post/post.actions';

import Button from '../button/button.component';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

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
  deleteReactionConfirm: string | null;
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
  postReactionsArray,
  postReactionConfirm,
  deleteReactionConfirm,
  custRef,
  createPostReactionStart,
  deleteReactionStart,
}) => {
  const [comment, setComment] = useState('');

  const [captionInfoArray, setCaptionInfoArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [reactionsArray, setReactionsArray] = useState<Reaction[] | null>(null);

  const [reactingUserInfoArray, setReactingUsersInfoArray] =
    useState<User[] | null>(null);

  const [userProfilePhotoArray, setUserProfilePhotoArray] =
    useState<PostFile[] | null>(null);

  const [commentingUserArray, setCommentingUserArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [postLikingUserArray, setPostLikingUserArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [alreadyLikedPost, setAlreadyLikedPost] = useState(false);

  useEffect(() => {
    if (userInfo.postId) {
      getPostReactionsStart(userInfo.postId);
    }
  }, [userInfo.postId]);

  useEffect(() => {
    if (postReactionsArray && postReactionsArray.length) {
      for (let innerArray of postReactionsArray) {
        if (innerArray.length && innerArray[0].postId === userInfo.postId) {
          setReactionsArray(innerArray);
        }
      }
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      console.log('reactionsArray: ', reactionsArray);
      for (let el of reactionsArray) {
        if (
          currentUser &&
          el.reactingUserId === currentUser.id &&
          el.likedPost
        ) {
          setAlreadyLikedPost(true);
        }
      }
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm === 'Post liked successfully!'
    ) {
      setAlreadyLikedPost(true);
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm === 'Like removed successfully!'
    ) {
      setAlreadyLikedPost(false);
    }
  }, [deleteReactionConfirm]);

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
        {handleRenderLikedOrLikedButton()}
        <div className='caption'>
          <span className='username'>{userInfo.username}</span>{' '}
          {caption ? caption : ''}
        </div>
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
  deleteReactionConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postReactionsArray: selectPostReactionsArray,
  postReactionConfirm: selectPostReactionConfirm,
  postReactionError: selectPostReactionError,
  getPostReactionsConfirm: selectGetPostReactionsConfirm,
  getPostReactionsError: selectGetPostReactionsError,
  deleteReactionConfirm: selectDeleteReactionConfirm,
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
