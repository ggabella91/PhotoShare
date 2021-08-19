import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';

import { AppState } from '../../redux/root-reducer';

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
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import {
  comparePostFileLists,
  compareUserOrPostOrReactionLists,
} from '../../pages/feed-page/feed-page.utils';

import Button from '../button/button.component';
import { ExpandableFormInput } from '../form-input/form-input.component';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  s3Key: string;
  caption?: string;
  date: string;
  custRef?: (node: HTMLDivElement | null) => void;
  key: number;
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
  location: string;
  name: string;
  comment: string;
}

export interface PostModalDataToFeed {
  id: string;
  postS3Key: string;
  postPhotoFileString: string;
  caption: string;
  location: string;
  date: string;
  profilePhotoFileString: string;
  postUserId: string;
  postUserName: string;
}

export const POST_MODAL_DATA_INITIAL_STATE: PostModalDataToFeed = {
  id: '',
  postS3Key: '',
  caption: '',
  postPhotoFileString: '',
  location: '',
  date: '',
  profilePhotoFileString: '',
  postUserId: '',
  postUserName: '',
};

export const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  s3Key,
  fileString,
  caption,
  date,
  custRef,
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

  const [reactionsList, setReactionsList] = useState<List<Reaction> | null>(
    null
  );

  const [reactingUserInfoList, setReactingUsersInfoList] =
    useState<List<User> | null>(null);

  const [userProfilePhotoList, setUserProfilePhotoList] =
    useState<List<PostFile> | null>(null);

  const [commentingUserList, setCommentingUserList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  const [likingUsersList, setLikingUsersList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  const [alreadyLikedPostAndReactionId, setAlreadyLikedPostAndReactionId] =
    useState({ alreadyLikedPost: false, reactionId: '' });

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
  };

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (userInfo.postId !== postId) {
      setPostId(userInfo.postId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (postId && !didFetchReactions) {
      console.log("Post ID changed so we're fetching reactions again...");
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });

      setDidFetchReactions(true);
    }
  }, [postId]);

  useEffect(() => {
    if (feedPostReactionsArray && feedPostReactionsArray.length) {
      feedPostReactionsArray.forEach((innerArray) => {
        let innerArrayAsList = List(innerArray);

        if (innerArray.length && innerArray[0].postId === postId) {
          if (
            !reactionsList ||
            (reactionsList &&
              !compareUserOrPostOrReactionLists(
                reactionsList,
                innerArrayAsList
              ))
          ) {
            setReactionsList(innerArrayAsList);
          }
        }
      });
    }
  }, [feedPostReactionsArray]);

  useEffect(() => {
    if (reactionsList && reactionsList.size) {
      reactionsList.forEach((el) => {
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
  }, [reactionsList]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      postReactionConfirm.postId === postId &&
      postModalProps.id
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });
      setLikingUsersList(List([]));
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      deleteReactionConfirm.postId === postId &&
      postModalProps.id
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setLikingUsersList(List([]));
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      postId
    ) {
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      postId
    ) {
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.feedPost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (reactionsList && reactionsList.size) {
      reactionsList.forEach((el) => {
        getOtherUserStart({
          type: OtherUserType.FEED_POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });
      });
    }
  }, [reactionsList]);

  useEffect(() => {
    let feedPostReactingUsersList;

    if (feedPostReactingUsers) {
      feedPostReactingUsersList = List(feedPostReactingUsers);
    } else {
      feedPostReactingUsersList = List([]);
    }

    if (feedPostReactingUsersList.size && !reactingUserInfoList) {
      setReactingUsersInfoList(feedPostReactingUsersList);
    } else if (
      feedPostReactingUsersList.size &&
      reactingUserInfoList &&
      !compareUserOrPostOrReactionLists(
        reactingUserInfoList,
        feedPostReactingUsersList
      )
    ) {
      setReactingUsersInfoList(feedPostReactingUsersList);
    }
  }, [feedPostReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoList && reactingUserInfoList.size) {
      reactingUserInfoList.forEach((el) => {
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
  }, [reactingUserInfoList]);

  useEffect(() => {
    let reactorPhotoFileList;

    if (reactorPhotoFileArray) {
      reactorPhotoFileList = List(reactorPhotoFileArray);
    } else {
      reactorPhotoFileList = List([]);
    }

    if (!userProfilePhotoList) {
      setUserProfilePhotoList(reactorPhotoFileList);
    } else if (
      userProfilePhotoList &&
      !userProfilePhotoList.equals(reactorPhotoFileList)
    ) {
      console.log(
        "userProfilePhotoList and reactorPhotoFileList don't equal with .equals() method"
      );

      if (comparePostFileLists(userProfilePhotoList, reactorPhotoFileList)) {
        console.log(
          'But userProfilePhotoList and reactorPhotoFileList do equal with comparePostFileLists() method'
        );
      }
      setUserProfilePhotoList(reactorPhotoFileList);
    }
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsList &&
      reactionsList.size &&
      reactingUserInfoList &&
      reactingUserInfoList.size &&
      ((userProfilePhotoList && userProfilePhotoList.size) ||
        (!userProfilePhotoList &&
          usersProfilePhotoConfirm === 'User photo added to reactor array!'))
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      reactionsList.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let profilePhotoFileString: string;

        reactingUserInfoList.forEach((infoEl) => {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        });

        if (userProfilePhotoList) {
          userProfilePhotoList.forEach((photoEl) => {
            if (photoEl.s3Key === photoKey!) {
              profilePhotoFileString = photoEl.fileString;
            }
          });
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
      });

      setCommentingUserList(List(commentsArray));
      setLikingUsersList(List(likesArray));
    }
  }, [
    reactionsList,
    reactingUserInfoList,
    userProfilePhotoList,
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
    }
    setComment('');
  };

  const handleRenderLikeOrLikedButton = () => {
    return (
      <Button
        className='likes-text'
        onClick={
          alreadyLikedPostAndReactionId.alreadyLikedPost
            ? () => handleSubmitRemoveLike()
            : () => handleSubmitLike()
        }
      >
        <span>
          {alreadyLikedPostAndReactionId.alreadyLikedPost ? 'Liked' : 'Like'}
        </span>
      </Button>
    );
  };

  const handleSubmitLike = () => {
    createPostReactionStart({
      reactingUserId: userInfo.userId,
      postId,
      likedPost: true,
      comment: '',
    });
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

    if (likingUsersList) {
      setPostLikingUsersArray(likingUsersList.toArray());
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
        {handleRenderLikeOrLikedButton()}
        {likingUsersList && likingUsersList.size ? (
          <Button
            className='likes-text'
            onClick={() => handlePostLikingUsersClick()}
          >
            <span>{`${likingUsersList.size} likes`}</span>
          </Button>
        ) : null}
        {caption ? (
          <div className='caption-or-reaction'>
            <span className='username'>{userInfo.username}</span>
            {caption}
          </div>
        ) : null}
        {commentingUserList && commentingUserList.size > 2 ? (
          <span
            className='view-all-comments'
            onClick={() => handleClickViewAllComments()}
          >{`View all ${commentingUserList.size} comments`}</span>
        ) : null}
        {commentingUserList
          ? commentingUserList.map((el, idx) => {
              if (idx >= commentingUserList.size - 2) {
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
          className={`${!comment ? 'greyed-out' : ''} submit-comment-button`}
          disabled={comment ? false : true}
          onClick={handleSubmitComment}
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
