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
  PostFileReq,
  PostFile,
  UserType,
  PostError,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectReactorPhotoFileArray,
  selectUsersProfilePhotoConfirm,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
  selectDeleteReactionConfirm,
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  setShowPostLikingUsersModal,
  setFeedPagePostModalData,
  setFeedPagePostModalShow,
  setClearFeedPagePostModalState,
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
  custRef?: (node: HTMLDivElement | null) => void;
  key: number;
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: string | null;
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  getOtherUserStart: typeof getOtherUserStart;
  getPostFileStart: typeof getPostFileStart;
  deleteReactionStart: typeof deleteReactionStart;
  setPostLikingUsersArray: typeof setPostLikingUsersArray;
  setShowPostLikingUsersModal: typeof setShowPostLikingUsersModal;
  setFeedPagePostModalData: typeof setFeedPagePostModalData;
  setFeedPagePostModalShow: typeof setFeedPagePostModalShow;
  setClearFeedPagePostModalState: typeof setClearFeedPagePostModalState;
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

export interface PostModalDataToFeed {
  id: string;
  postPhotoFileString: string;
  caption: string;
  location: string;
  date: string;
  profilePhotoFileString: string;
  postUserId: string;
  postUserName: string;
}

export const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  fileString,
  caption,
  date,
  custRef,
  currentUser,
  postReactionsArray,
  postReactingUsers,
  reactorPhotoFileArray,
  usersProfilePhotoConfirm,
  postReactionConfirm,
  deleteReactionConfirm,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  createPostReactionStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  setShowPostLikingUsersModal,
  setFeedPagePostModalData,
  setFeedPagePostModalShow,
  setClearFeedPagePostModalState,
}) => {
  const [comment, setComment] = useState('');

  const [reactionsArray, setReactionsArray] = useState<Reaction[] | null>(null);

  const [reactingUserInfoArray, setReactingUsersInfoArray] =
    useState<User[] | null>(null);

  const [userProfilePhotoArray, setUserProfilePhotoArray] =
    useState<PostFile[] | null>(null);

  const [commentingUserArray, setCommentingUserArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [likingUsersArray, setLikingUsersArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [alreadyLikedPost, setAlreadyLikedPost] = useState(false);

  const [postModalProps, setPostModalProps] = useState<PostModalDataToFeed>({
    id: userInfo.postId,
    caption: caption || '',
    postPhotoFileString: fileString,
    location: userInfo.location,
    date: date,
    profilePhotoFileString: userInfo.profilePhotoFileString,
    postUserId: userInfo.userId,
    postUserName: userInfo.username,
  });

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

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
    if (reactingUserInfoArray && reactingUserInfoArray.length) {
      for (let el of reactingUserInfoArray) {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
          });
        }
      }
    }
  }, [reactingUserInfoArray]);

  useEffect(() => {
    if (reactorPhotoFileArray) {
      setUserProfilePhotoArray(reactorPhotoFileArray);
    }
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsArray &&
      reactionsArray.length &&
      reactingUserInfoArray &&
      reactingUserInfoArray.length &&
      reactingUserInfoArray.length &&
      ((userProfilePhotoArray && userProfilePhotoArray.length) ||
        (!userProfilePhotoArray &&
          usersProfilePhotoConfirm === 'User photo added to reactor array!'))
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      for (let reactionEl of reactionsArray) {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let profilePhotoFileString: string;

        for (let infoEl of reactingUserInfoArray) {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        }

        if (userProfilePhotoArray) {
          for (let photoEl of userProfilePhotoArray) {
            if (photoEl.s3Key === photoKey!) {
              profilePhotoFileString = photoEl.fileString;
            }
          }
        }

        if (!photoKey!) {
          profilePhotoFileString = '';
        }

        if (!comment) {
          comment = '';
        }

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            name: name!,
            comment: '',
            profilePhotoFileString: profilePhotoFileString!,
            location: '',
          });
        } else {
          commentsArray.push({
            username: username!,
            name: '',
            comment,
            profilePhotoFileString: '',
            location: '',
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
          });
        }
      }

      setCommentingUserArray(commentsArray);
      setLikingUsersArray(likesArray);
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

  const handlePostLikingUsersClick = () => {
    setShowPostLikingUsersModal(true);

    if (likingUsersArray) {
      setPostLikingUsersArray(likingUsersArray);
    }
  };

  const handleClickViewAllComments = () => {
    setFeedPagePostModalShow(true);
    setClearFeedPagePostModalState(false);

    setFeedPagePostModalData(postModalProps);
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
        {likingUsersArray && likingUsersArray.length ? (
          <Button
            className='likes-text'
            onClick={() => handlePostLikingUsersClick()}
          >
            <span>{`${likingUsersArray.length} likes`}</span>
          </Button>
        ) : null}
        <div className='caption-or-reaction'>
          <span className='username'>{userInfo.username}</span>
          {caption ? caption : ''}
        </div>
        {commentingUserArray && commentingUserArray.length > 2 ? (
          <span
            className='view-all-comments'
            onClick={() => handleClickViewAllComments()}
          >{`View all ${commentingUserArray.length} comments`}</span>
        ) : null}
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
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
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
  reactorPhotoFileArray: selectReactorPhotoFileArray,
  usersProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
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
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  setPostLikingUsersArray: (postLikingUsersArray: UserInfoAndOtherData[]) =>
    dispatch(setPostLikingUsersArray(postLikingUsersArray)),
  setShowPostLikingUsersModal: (showPostLikingUsersModal: boolean) =>
    dispatch(setShowPostLikingUsersModal(showPostLikingUsersModal)),
  setFeedPagePostModalData: (postModalDataToFeed: PostModalDataToFeed) =>
    dispatch(setFeedPagePostModalData(postModalDataToFeed)),
  setFeedPagePostModalShow: (feedPagePostModalShow: boolean) =>
    dispatch(setFeedPagePostModalShow(feedPagePostModalShow)),
  setClearFeedPagePostModalState: (clearFeedPagePostModalState: boolean) =>
    dispatch(setClearFeedPagePostModalState(clearFeedPagePostModalState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPostContainer);
