import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { AppState } from '../../redux/root-reducer';

import { postNotificationStart } from '../../redux/follower/follower.actions';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectFeedPostReactingUsers,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Reaction,
  ReactionReq,
  ReactionConfirm,
  PostFileReq,
  FileRequestType,
  ReactionRequestType,
  GetPostReactionsReq,
  PostFile,
  UserType,
  PostError,
  DeleteReactionReq,
  DeleteReactionConfirm,
  Location,
} from '../../redux/post/post.types';
import {
  selectFeedPostReactionsArray,
  selectFeedReactorPhotoFileArray,
  selectFeedUsersProfilePhotoConfirm,
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
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostLikingUsersModal,
  setFeedPagePostModalData,
  setFeedPagePostModalShow,
  setClearFeedPagePostModalState,
  removePostModalDataFromCache,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import {
  compareUserOrPostOrReactionArrays,
  comparePostFileArrays,
  compareUserInfoAndDataObjArrays,
} from '../../pages/feed-page/feed-page.utils';

import Button from '../button/button.component';
import { ExpandableFormInput } from '../form-input/form-input.component';

import './feed-post-container.styles.scss';

type CustomRef = (node: HTMLDivElement | null) => void;

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  s3Key: string;
  caption?: string;
  date: string;
  custRef: CustomRef | null;
  id: string;
  currentUser: User | null;
  feedPostReactionsArray: Reaction[][];
  feedPostReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  postReactionConfirm: ReactionConfirm | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: DeleteReactionConfirm | null;
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
  clearPostReactions: typeof clearPostReactions;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  userId: string;
  username: string;
  postId: string;
  location: Location;
  name: string;
  comment: string;
  isVideo?: boolean;
}

export interface PostModalDataToFeed {
  id: string;
  postS3Key: string;
  postPhotoFileString: string;
  caption: string;
  location: Location;
  date: string;
  profilePhotoFileString: string;
  postUserId: string;
  postUserName: string;
  isVideo?: boolean;
}

export const POST_MODAL_DATA_INITIAL_STATE: PostModalDataToFeed = {
  id: '',
  postS3Key: '',
  caption: '',
  postPhotoFileString: '',
  location: {} as Location,
  date: '',
  profilePhotoFileString: '',
  postUserId: '',
  postUserName: '',
  isVideo: false,
};

export const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  s3Key,
  fileString,
  caption,
  date,
  custRef,
  id,
  currentUser,
  feedPostReactionsArray,
  feedPostReactingUsers,
  reactorPhotoFileArray,
  usersProfilePhotoConfirm,
  postReactionConfirm,
  deleteReactionConfirm,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  createPostReactionStart,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostLikingUsersModal,
  setFeedPagePostModalData,
  setFeedPagePostModalShow,
  setClearFeedPagePostModalState,
}) => {
  const [postId, setPostId] = useState('');

  const [didFetchReactions, setDidFetchReactions] = useState(false);

  const [comment, setComment] = useState('');

  const [reactionsArray, setReactionsArray] = useState<Reaction[]>([]);

  const [reactingUserInfoArray, setReactingUsersInfoArray] = useState<User[]>(
    []
  );

  const [userProfilePhotoArray, setUserProfilePhotoArray] = useState<
    PostFile[]
  >([]);

  const [commentingUserArray, setCommentingUserArray] = useState<
    UserInfoAndOtherData[]
  >([]);

  const [likingUsersArray, setLikingUsersArray] = useState<
    UserInfoAndOtherData[]
  >([]);

  const [alreadyLikedPostAndReactionId, setAlreadyLikedPostAndReactionId] =
    useState({ alreadyLikedPost: false, reactionId: '' });

  const [playVideo, setPlayVideo] = useState(false);

  const { isVideo } = userInfo;

  const dispatch = useDispatch();

  let postModalProps: PostModalDataToFeed = {
    id: userInfo.postId,
    postS3Key: s3Key,
    caption: caption || '',
    postPhotoFileString: fileString,
    location: userInfo.location,
    date: date,
    profilePhotoFileString: userInfo.profilePhotoFileString,
    postUserId: userInfo.userId,
    postUserName: userInfo.username,
    isVideo: userInfo.isVideo,
  };

  let bucket: string;

  process.env.NODE_ENV === 'production'
    ? (bucket = 'photo-share-app-profile-photos')
    : (bucket = 'photo-share-app-profile-photos-dev');

  useEffect(() => {
    if (userInfo.postId !== postId) {
      setPostId(userInfo.postId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (postId && !didFetchReactions) {
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });

      setDidFetchReactions(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    if (feedPostReactionsArray && feedPostReactionsArray.length) {
      feedPostReactionsArray.forEach((innerArray) => {
        if (innerArray.length && innerArray[0].postId === postId) {
          if (
            reactionsArray &&
            !compareUserOrPostOrReactionArrays(reactionsArray, innerArray)
          ) {
            setReactionsArray(innerArray);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPostReactionsArray]);

  useEffect(() => {
    if (reactionsArray.length) {
      reactionsArray.forEach((el) => {
        if (
          currentUser &&
          el.reactingUserId === currentUser.id &&
          el.likedPost
        ) {
          setAlreadyLikedPostAndReactionId({
            alreadyLikedPost: true,
            reactionId: el.id,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionsArray]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      clearPostReactions();

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });
      setLikingUsersArray([]);
      dispatch(removePostModalDataFromCache(postId));
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      clearPostReactions();

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setLikingUsersArray([]);
      dispatch(removePostModalDataFromCache(postId));
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      clearPostReactions();

      dispatch(removePostModalDataFromCache(postId));
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      clearPostReactions();

      dispatch(removePostModalDataFromCache(postId));
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (reactionsArray.length) {
      reactionsArray.forEach((el) => {
        getOtherUserStart({
          type: OtherUserType.FEED_POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionsArray]);

  useEffect(() => {
    let feedPostReactingUsersList;

    if (feedPostReactingUsers) {
      feedPostReactingUsersList = [...feedPostReactingUsers];
    } else {
      return;
    }

    if (
      feedPostReactingUsersList.length &&
      !compareUserOrPostOrReactionArrays(
        reactingUserInfoArray,
        feedPostReactingUsersList
      )
    ) {
      setReactingUsersInfoArray(feedPostReactingUsersList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPostReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoArray.length) {
      reactingUserInfoArray.forEach((el) => {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
            fileRequestType: FileRequestType.feedPost,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactingUserInfoArray]);

  useEffect(() => {
    if (!reactorPhotoFileArray) {
      return;
    }

    if (
      userProfilePhotoArray &&
      !comparePostFileArrays(userProfilePhotoArray, reactorPhotoFileArray)
    ) {
      setUserProfilePhotoArray(reactorPhotoFileArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsArray.length &&
      reactingUserInfoArray.length &&
      userProfilePhotoArray.length &&
      reactingUserInfoArray.length === userProfilePhotoArray.length
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      reactionsArray.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment || '';
        let photoKey: string = '';
        let profilePhotoFileString: string = '';

        reactingUserInfoArray.forEach((infoEl) => {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        });

        userProfilePhotoArray.forEach((photoEl) => {
          if (photoEl.s3Key === photoKey) {
            profilePhotoFileString = photoEl.fileString;
          }
        });

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            name: name!,
            comment: '',
            profilePhotoFileString: profilePhotoFileString!,
            location: {} as Location,
          });
        } else {
          commentsArray.push({
            username: username!,
            name: '',
            comment,
            profilePhotoFileString: '',
            location: {} as Location,
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
          });
        }
      });

      if (
        !compareUserInfoAndDataObjArrays(commentingUserArray, commentsArray)
      ) {
        setCommentingUserArray(commentsArray);
      }

      if (!compareUserInfoAndDataObjArrays(likingUsersArray, likesArray)) {
        setLikingUsersArray(likesArray);
        setPostLikingUsersArray(likesArray);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reactionsArray,
    reactingUserInfoArray,
    userProfilePhotoArray,
    usersProfilePhotoConfirm,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setComment(value);
  };

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (comment && currentUser) {
      createPostReactionStart({
        reactingUserId: currentUser.id,
        postId,
        likedPost: false,
        comment,
      });

      dispatch(
        postNotificationStart({
          fromUserId: currentUser.id,
          toUserId: userInfo.userId,
          message: `${currentUser.username} commented: ${comment}`,
          postId,
        })
      );
    }
    setComment('');
  };

  const handleRenderLikeOrLikedButton = () => {
    return (
      <Button className='like-button' onClick={handleClickLikeButton}>
        {alreadyLikedPostAndReactionId.alreadyLikedPost ? (
          <FavoriteIcon className='likes-icon' htmlColor='red' />
        ) : (
          <FavoriteBorderIcon className='likes-icon' />
        )}
      </Button>
    );
  };

  const handleClickLikeButton = () =>
    alreadyLikedPostAndReactionId.alreadyLikedPost
      ? handleSubmitRemoveLike()
      : handleSubmitLike();

  const handleSubmitLike = () => {
    createPostReactionStart({
      reactingUserId: userInfo.userId,
      postId,
      likedPost: true,
      comment: '',
    });

    if (currentUser) {
      dispatch(
        postNotificationStart({
          fromUserId: currentUser.id,
          toUserId: userInfo.userId,
          message: `${currentUser.username} liked your post.`,
          postId,
        })
      );
    }
  };

  const handleSubmitRemoveLike = () => {
    deleteReactionStart({
      reactingUserId: currentUser!.id,
      reactionId: alreadyLikedPostAndReactionId.reactionId,
      isLikeRemoval: true,
      postId,
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

  const handleClickPlayArrowIcon = () => setPlayVideo(true);

  return (
    <div
      className='feed-post-container'
      ref={custRef}
      id={id}
      data-testid='feed-post-container'
    >
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[userInfo]} />
      </div>
      <div className='media-background'>
        {!playVideo ? (
          <>
            <img
              className='feed-post-photo'
              src={`data:image/jpeg;base64,${fileString}`}
              alt='user'
            />
            {isVideo && (
              <PlayArrowIcon
                className='play-arrow-icon'
                onClick={handleClickPlayArrowIcon}
              />
            )}
          </>
        ) : null}
        {playVideo && (
          <video className='feed-post-video' controls muted>
            <source src={`/api/posts/video?s3Key=${s3Key}`} />
          </video>
        )}
      </div>
      <div className='caption-and-reactions'>
        {handleRenderLikeOrLikedButton()}
        {likingUsersArray && likingUsersArray.length ? (
          <Button className='likes' onClick={handlePostLikingUsersClick}>
            <span>{`${likingUsersArray.length} likes`}</span>
          </Button>
        ) : null}
        {caption ? (
          <div className='caption-or-reaction'>
            <span className='username'>{userInfo.username}</span>
            {caption}
          </div>
        ) : null}
        {commentingUserArray.length > 2 ? (
          <span
            className='view-all-comments'
            onClick={handleClickViewAllComments}
          >{`View all ${commentingUserArray.length} comments`}</span>
        ) : null}
        {commentingUserArray.length
          ? commentingUserArray.map((el, idx) =>
              idx >= commentingUserArray.length - 2 ? (
                <div className='caption-or-reaction'>
                  <span className='username'>{el.username}</span> {el.comment}
                </div>
              ) : null
            )
          : null}
        <span className='date'>{date}</span>
      </div>
      <form className='comment-form' onSubmit={handleSubmitComment}>
        <ExpandableFormInput
          tall={true}
          onChange={handleChange}
          name='comment'
          type='textarea'
          value={comment}
          label='Add a comment...'
        />
        <Button
          className={`${!comment ? 'greyed-out ' : ''}submit-comment-button`}
          disabled={comment ? false : true}
          onClick={handleSubmitComment}
          data-testid='submit-comment-button'
        >
          <span>Post</span>
        </Button>
      </form>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  feedPostReactionsArray: Reaction[][];
  feedPostReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  postReactionConfirm: ReactionConfirm | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: DeleteReactionConfirm | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  feedPostReactionsArray: selectFeedPostReactionsArray,
  feedPostReactingUsers: selectFeedPostReactingUsers,
  reactorPhotoFileArray: selectFeedReactorPhotoFileArray,
  usersProfilePhotoConfirm: selectFeedUsersProfilePhotoConfirm,
  postReactionConfirm: selectPostReactionConfirm,
  postReactionError: selectPostReactionError,
  getPostReactionsConfirm: selectGetPostReactionsConfirm,
  getPostReactionsError: selectGetPostReactionsError,
  deleteReactionConfirm: selectDeleteReactionConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostReactionStart: (reactionReq: ReactionReq) =>
    dispatch(createPostReactionStart(reactionReq)),
  getPostReactionsStart: (getPostReactionsReq: GetPostReactionsReq) =>
    dispatch(getPostReactionsStart(getPostReactionsReq)),
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  clearPostReactions: () => dispatch(clearPostReactions()),
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
