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
import { getOtherUserStart } from '../../redux/user/user.actions';

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

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';

export interface UserInfoAndOtherDataLite {
  username: string;
  comment: string;
  reactionId?: string;
  reactingUserId?: string;
}

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  caption?: string;
  date: string;
  custRef?: (node: HTMLDivElement | null) => void;
  key: number;
  onPostLikingUsersClick?: () => void;
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactingUsers: User[] | null;
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: string | null;
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  getOtherUserStart: typeof getOtherUserStart;
  deleteReactionStart: typeof deleteReactionStart;
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
  custRef,
  onPostLikingUsersClick,
  currentUser,
  postReactionsArray,
  postReactingUsers,
  postReactionConfirm,
  deleteReactionConfirm,
  getPostReactionsStart,
  getOtherUserStart,
  createPostReactionStart,
  deleteReactionStart,
}) => {
  const [comment, setComment] = useState('');

  const [reactionsArray, setReactionsArray] = useState<Reaction[] | null>(null);

  const [reactingUserInfoArray, setReactingUsersInfoArray] =
    useState<User[] | null>(null);

  const [commentingUserArray, setCommentingUserArray] =
    useState<UserInfoAndOtherDataLite[] | null>(null);

  const [postLikingUserArray, setPostLikingUserArray] =
    useState<UserInfoAndOtherDataLite[] | null>(null);

  const [alreadyLikedPost, setAlreadyLikedPost] = useState(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  useEffect(() => {
    if (userInfo.postId) {
      getPostReactionsStart(userInfo.postId);
    }
  }, [userInfo.postId]);

  useEffect(() => {
    if (postReactionsArray && postReactionsArray.length) {
      console.log('postReactionsArray: ', postReactionsArray);
      for (let innerArray of postReactionsArray) {
        if (innerArray.length && innerArray[0].postId === userInfo.postId) {
          setReactionsArray(innerArray);
        }
      }
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
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

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      for (let el of reactionsArray) {
        getOtherUserStart({
          type: OtherUserType.POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });
      }
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (postReactingUsers && postReactingUsers.length) {
      setReactingUsersInfoArray(postReactingUsers);
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (
      reactionsArray &&
      reactionsArray.length &&
      reactingUserInfoArray &&
      reactingUserInfoArray.length
    ) {
      let commentsArray: UserInfoAndOtherDataLite[] = [];
      let likesArray: UserInfoAndOtherDataLite[] = [];

      for (let reactionEl of reactionsArray) {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let comment = reactionEl.comment;

        for (let infoEl of reactingUserInfoArray) {
          if (infoEl.id === userId) {
            username = infoEl.username;
          }
        }

        if (!comment) {
          comment = '';
        }

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            comment: '',
          });
        } else {
          commentsArray.push({
            username: username!,
            comment,
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
          });
        }
      }

      setCommentingUserArray(commentsArray);
      setPostLikingUserArray(likesArray);
    }
  }, [reactionsArray, reactingUserInfoArray]);

  const handleRenderLikedOrLikedButton = () => {
    return (
      <Button
        className='likes-text'
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
        {postLikingUserArray && postLikingUserArray.length ? (
          <span className='likes-text' onClick={onPostLikingUsersClick}>
            {`${postLikingUserArray.length} likes`}
          </span>
        ) : null}
        <div className='caption-or-reaction'>
          <span className='username'>{userInfo.username}</span>{' '}
          {caption ? caption : ''}
        </div>
        {commentingUserArray
          ? commentingUserArray.map((el, idx) => {
              if (idx >= commentingUserArray.length - 2) {
                return (
                  <div className='caption-or-reaction'>
                    <span className='username'>{el.username}</span> {el.comment}
                  </div>
                );
              } else {
                return null;
              }
            })
          : null}
        <span className='date'>{date}</span>
      </div>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactingUsers: User[] | null;
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postReactionsArray: selectPostReactionsArray,
  postReactingUsers: selectPostReactingUsers,
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
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPostContainer);
