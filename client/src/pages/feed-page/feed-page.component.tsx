import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

import { AppState } from '../../redux/root-reducer';

import { useLazyLoading } from '../../hooks';

import {
  User,
  OtherUserRequest,
  OtherUserType,
} from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectFollowingInfo,
} from '../../redux/user/user.selectors';
import {
  getOtherUserStart,
  clearFollowersAndFollowing,
} from '../../redux/user/user.actions';

import {
  Post,
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  PostFile,
  PostError,
  ArchivePostReq,
  UserType,
  PostMetaData,
  DeleteReactionReq,
  Location,
} from '../../redux/post/post.types';
import {
  selectPostDataFeedArray,
  selectFollowPhotoFileArray,
  selectPostError,
  selectGetFeedPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
  selectIsLoadingPostData,
  selectPostMetaDataForUser,
  selectPostLikingUsersArray,
  selectShowPostLikingUsersModal,
  selectFeedPagePostModalData,
  selectFeedPagePostModalShow,
  selectFeedPagePostOptionsModalShow,
  selectClearFeedPagePostModalState,
  selectFeedPostFiles,
  selectShowCommentOptionsModal,
  selectCommentToDelete,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearPostState,
  setShowPostLikingUsersModal,
  setFeedPagePostModalShow,
  setFeedPagePostOptionsModalShow,
  setClearFeedPagePostModalState,
  setShowCommentOptionsModal,
  deleteReactionStart,
} from '../../redux/post/post.actions';

import {
  Follower,
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  selectCurrentUserUsersFollowing,
  selectGetUsersFollowingConfirm,
} from '../../redux/follower/follower.selectors';
import {
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

import FeedPostContainer, {
  PostModalDataToFeed,
  POST_MODAL_DATA_INITIAL_STATE,
} from '../../components/feed-post-container/feed-post-container.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';

import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import { prepareUserInfoAndFileArray } from './feed-page.utils';
import './feed-page.styles.scss';

export interface UserLite {
  id: string;
  name: string;
  username: string;
  bio: string;
}

export interface PostDataListMap {
  postData: Post[];
  queryLength?: number;
  userId: string;
}

export interface UserInfoAndPostFile {
  profilePhotoFileString: string;
  username: string;
  userId: string;
  location: Location;
  postId: string;
  postS3Key: string;
  postFileString: string;
  caption?: string;
  dateString: string;
  dateInt: number;
  isVideo?: boolean;
}

interface FeedPageProps {
  currentUser: User | null;
  postDataFeedArray: Post[][];
  postFiles: PostFile[];
  postError: PostError | null;
  getFeedPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  currentUserUsersFollowing: Follower[] | null;
  followingInfo: User[] | null;
  followPhotoFileArray: PostFile[] | null;
  getUsersFollowingConfirm: string | null;
  isLoadingPostData: boolean;
  postMetaDataForUser: PostMetaData | null;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  showPostLikingUsersModal: boolean;
  feedPagePostModalData: PostModalDataToFeed;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
  showCommentOptionsModal: boolean;
  commentToDelete: DeleteReactionReq | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
  clearPostState: typeof clearPostState;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  getOtherUserStart: typeof getOtherUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
  setShowPostLikingUsersModal: typeof setShowPostLikingUsersModal;
  setFeedPagePostModalShow: typeof setFeedPagePostModalShow;
  setFeedPagePostOptionsModalShow: typeof setFeedPagePostOptionsModalShow;
  setClearFeedPagePostModalState: typeof setClearFeedPagePostModalState;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  deleteReactionStart: typeof deleteReactionStart;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  currentUser,
  postDataFeedArray,
  postFiles,
  currentUserUsersFollowing,
  followingInfo,
  followPhotoFileArray,
  isLoadingPostData,
  postMetaDataForUser,
  getFeedPostDataConfirm,
  getPostDataStart,
  getPostFileStart,
  clearPostState,
  getUsersFollowingStart,
  getOtherUserStart,
  clearFollowersAndFollowing,
  clearFollowState,
  postLikingUsersArray,
  showPostLikingUsersModal,
  setShowPostLikingUsersModal,
  feedPagePostModalData,
  feedPagePostModalShow,
  feedPagePostOptionsModalShow,
  showCommentOptionsModal,
  commentToDelete,
  setFeedPagePostModalShow,
  setFeedPagePostOptionsModalShow,
  setClearFeedPagePostModalState,
  setShowCommentOptionsModal,
  deleteReactionStart,
}) => {
  const [dataFeedMapArray, setDataFeedMapArray] = useState<PostDataListMap[]>(
    []
  );

  const [pageToFetch, setPageToFetch] = useState(1);

  const { intersectionCounter, observedElementRef } =
    useLazyLoading(isLoadingPostData);

  const [postModalProps, setPostModalProps] = useState<PostModalDataToFeed>(
    POST_MODAL_DATA_INITIAL_STATE
  );

  const [showLikingUsersModal, setShowLikingUsersModal] = useState(false);

  const [postModalShow, setPostModalShow] = useState(false);

  const [clearPostModalState, setClearPostModalState] = useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [currentUserPost, setCurrentUserPost] = useState<boolean>(false);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] =
    useState<boolean>(false);

  const [noProfilePhotosToFetch, setNoProfilePhotosToFetch] = useState(false);

  let navigate = useNavigate();

  const postState = useSelector((state: AppState) => state.post);

  const { feedPagePostIdForNavigation } = postState;

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(
    // Clear post state when cleaning up before component
    // leaves the screen
    () => () => {
      clearPostState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    clearPostState();
    clearFollowState();
    clearFollowersAndFollowing();

    getUsersFollowingStart({
      userId: currentUser.id,
      whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    currentUserUsersFollowing?.forEach((user) => {
      if (currentUser) {
        getOtherUserStart({
          usernameOrId: user.userId,
          type: OtherUserType.FOLLOWING,
        });

        getPostDataStart({
          userId: user.userId,
          dataReqType: DataRequestType.feed,
          pageToShow: pageToFetch,
          limit: 2,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserUsersFollowing]);

  useEffect(() => {
    if (postMetaDataForUser) {
      const newDataFeedMapList = dataFeedMapArray.map((el) => {
        if (postMetaDataForUser.userId === el.userId) {
          let elCopy = { ...el };
          elCopy.queryLength = postMetaDataForUser.queryLength;
          return elCopy;
        }

        return el;
      });

      setDataFeedMapArray(newDataFeedMapList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postMetaDataForUser]);

  useEffect(() => {
    if (intersectionCounter > 1) {
      dataFeedMapArray.forEach((el) => {
        if (
          el.queryLength &&
          currentUser &&
          pageToFetch + 1 <= Math.ceil(el.queryLength / 2)
        ) {
          getPostDataStart({
            userId: el.userId,
            dataReqType: DataRequestType.feed,
            pageToShow: pageToFetch + 1,
            limit: 2,
          });

          setPageToFetch(pageToFetch + 1);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectionCounter]);

  useEffect(() => {
    if (postDataFeedArray.length) {
      if (dataFeedMapArray.length) {
        postDataFeedArray.forEach((el) => {
          dataFeedMapArray.forEach((mapEl) => {
            if (el[0].userId === mapEl.userId) {
              mapEl.postData = [...el];
            }
          });
        });

        setDataFeedMapArray(dataFeedMapArray);
      } else {
        let dataMapArray: PostDataListMap[] = [];

        postDataFeedArray.forEach((el) => {
          dataMapArray.push({
            postData: [...el],
            userId: el[0].userId,
          });
        });

        setDataFeedMapArray(dataMapArray);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDataFeedArray]);

  useEffect(() => {
    if (currentUser) {
      let fetchCount = 0;
      followingInfo?.forEach((el) => {
        if (el.photo) {
          fetchCount++;
          getPostFileStart({
            s3Key: el.photo,
            bucket: profileBucket,
            user: UserType.followArray,
            fileRequestType: FileRequestType.feedPost,
          });
        }
      });

      if (fetchCount === 0) {
        setNoProfilePhotosToFetch(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followingInfo]);

  useEffect(() => {
    if (currentUser) {
      dataFeedMapArray.forEach((innerObj) => {
        innerObj.postData.forEach((el) => {
          getPostFileStart({
            s3Key: el.s3Key,
            isVideo: el.isVideo,
            videoThumbnailS3Key: el.videoThumbnailS3Key,
            bucket: postsBucket,
            user: UserType.other,
            fileRequestType: FileRequestType.feedPost,
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFeedMapArray, getFeedPostDataConfirm]);

  const userInfoAndPostFileList = useMemo(() => {
    if (
      dataFeedMapArray.length &&
      (followPhotoFileArray?.length || noProfilePhotosToFetch) &&
      postFiles &&
      followingInfo &&
      followPhotoFileArray
    ) {
      let postDataMultiArray: Post[][] = [];

      dataFeedMapArray.forEach((el) => {
        postDataMultiArray.push(el.postData);
      });

      const userInfoAndPostObjList = prepareUserInfoAndFileArray(
        followingInfo,
        postDataMultiArray,
        followPhotoFileArray,
        postFiles
      );

      const sortedUserInfoAndPostList = userInfoAndPostObjList.sort(
        (a, b) => b.dateInt - a.dateInt
      );

      return sortedUserInfoAndPostList;
    }
  }, [
    followingInfo,
    dataFeedMapArray,
    followPhotoFileArray,
    postFiles,
    noProfilePhotosToFetch,
  ]);

  useEffect(() => {
    if (feedPagePostModalData.id) {
      setPostModalProps(feedPagePostModalData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPagePostModalData.id]);

  useEffect(() => {
    setShowLikingUsersModal(showPostLikingUsersModal);
  }, [showPostLikingUsersModal]);

  useEffect(() => {
    if (feedPagePostModalShow) {
      setPostModalShow(feedPagePostModalShow);
      setFeedPagePostModalShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPagePostModalShow]);

  useEffect(() => {
    if (clearPostModalState) {
      setClearPostModalState(false);
    }
  }, [clearPostModalState]);

  useEffect(() => {
    setPostOptionsModalShow(feedPagePostOptionsModalShow);
  }, [feedPagePostOptionsModalShow]);

  useEffect(() => {
    if (postModalProps.postUserId) {
      handleSetIsCurrentUserPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postModalProps]);

  const handleHideLikesModal = () => setShowPostLikingUsersModal(false);

  const handleHidePostModal = () => {
    setPostModalShow(false);
    setClearFeedPagePostModalState(true);
  };

  const handlePostOptionsClick = () => setFeedPagePostOptionsModalShow(true);

  const handlePostLikingUsersClick = () => setShowPostLikingUsersModal(true);

  const handleHidePostOptionsModal = () =>
    setFeedPagePostOptionsModalShow(false);

  const handleSetIsCurrentUserPost = () => {
    if (currentUser && postModalProps.postUserId) {
      if (postModalProps.postUserId === currentUser.id) {
        setCurrentUserPost(true);
      } else {
        setCurrentUserPost(false);
      }
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
      if (commentToDelete.reactingUserId === currentUser.id) {
        setCurrentUserPostOrComment(true);
      } else {
        setCurrentUserPostOrComment(false);
      }
    }
  };

  const handleGoToPostClick = () => {
    navigate(`/p/${feedPagePostIdForNavigation}`);
  };

  const handleArchivePost = () =>
    archivePostStart({
      postId: postModalProps.id,
      s3Key: postModalProps.postS3Key,
    });

  const handleHideCommentOptionsModal = () => setShowCommentOptionsModal(false);

  const handleArchiveComment = () => {
    if (commentToDelete) {
      deleteReactionStart(commentToDelete);
    }
    setShowCommentOptionsModal(false);
  };

  return (
    <div className='feed-page' data-testid='feed-page'>
      {!!userInfoAndPostFileList?.length &&
        userInfoAndPostFileList.map((el, idx) => (
          <FeedPostContainer
            userInfo={{
              profilePhotoFileString: el.profilePhotoFileString,
              username: el.username,
              userId: el.userId,
              postId: el.postId,
              location: el.location,
              name: '',
              comment: '',
              isVideo: el.isVideo,
            }}
            s3Key={el.postS3Key}
            fileString={el.postFileString}
            caption={el.caption}
            date={el.dateString}
            key={el.postId}
            id={el.postId}
            custRef={
              idx === userInfoAndPostFileList.length - 1
                ? observedElementRef
                : null
            }
          />
        ))}
      {isLoadingPostData ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : null}
      {currentUserUsersFollowing && !currentUserUsersFollowing.length ? (
        <div className='no-franz'>
          Follow users to see their recent posts here
        </div>
      ) : null}
      {postLikingUsersArray ? (
        <FollowersOrFollowingOrLikesModal
          currentOrOtherUser='current'
          show={showLikingUsersModal}
          onHide={handleHideLikesModal}
          isPostLikingUsersModal={true}
          postLikingUsersArray={postLikingUsersArray}
        />
      ) : null}
      <PostModal
        postId={postModalProps.id}
        show={postModalShow}
        isVideo={postModalProps.isVideo}
        fileString={postModalProps.postPhotoFileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={postModalProps.date || ''}
        onHide={handleHidePostModal}
        onOptionsClick={handlePostOptionsClick}
        onPostLikingUsersClick={handlePostLikingUsersClick}
        userProfilePhotoFile={postModalProps.profilePhotoFileString || ''}
        userName={postModalProps.postUserName}
        userId={postModalProps.postUserId}
        clearLocalState={clearPostModalState}
        s3Key={postModalProps.postS3Key}
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={handleHidePostOptionsModal}
        isCurrentUserPostOrComment={currentUserPost}
        postOptionsModal={true}
        onGoToPostClick={handleGoToPostClick}
        archive={handleArchivePost}
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={handleHideCommentOptionsModal}
        archive={handleArchiveComment}
        isCurrentUserPostOrComment={currentUserPostOrComment}
        postOptionsModal={false}
      />
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postDataFeedArray: Post[][];
  postFiles: PostFile[];
  postError: PostError | null;
  getFeedPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  currentUserUsersFollowing: Follower[] | null;
  followingInfo: User[] | null;
  followPhotoFileArray: PostFile[] | null;
  getUsersFollowingConfirm: string | null;
  isLoadingPostData: boolean;
  postMetaDataForUser: PostMetaData | null;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  showPostLikingUsersModal: boolean;
  feedPagePostModalData: PostModalDataToFeed;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
  showCommentOptionsModal: boolean;
  commentToDelete: DeleteReactionReq | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postDataFeedArray: selectPostDataFeedArray,
  postFiles: selectFeedPostFiles,
  postError: selectPostError,
  getFeedPostDataConfirm: selectGetFeedPostDataConfirm,
  getPostDataError: selectGetPostDataError,
  getPostFileConfirm: selectGetPostFileConfirm,
  getPostFileError: selectGetPostFileError,
  currentUserUsersFollowing: selectCurrentUserUsersFollowing,
  followingInfo: selectFollowingInfo,
  followPhotoFileArray: selectFollowPhotoFileArray,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
  isLoadingPostData: selectIsLoadingPostData,
  postMetaDataForUser: selectPostMetaDataForUser,
  postLikingUsersArray: selectPostLikingUsersArray,
  showPostLikingUsersModal: selectShowPostLikingUsersModal,
  feedPagePostModalData: selectFeedPagePostModalData,
  feedPagePostModalShow: selectFeedPagePostModalShow,
  feedPagePostOptionsModalShow: selectFeedPagePostOptionsModalShow,
  clearFeedPagePostModalState: selectClearFeedPagePostModalState,
  showCommentOptionsModal: selectShowCommentOptionsModal,
  commentToDelete: selectCommentToDelete,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  archivePostStart: (archiveReq: ArchivePostReq) =>
    dispatch(archivePostStart(archiveReq)),
  clearPostState: () => dispatch(clearPostState()),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  getOtherUserStart: (otherUserRequest: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserRequest)),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearFollowState: () => dispatch(clearFollowState()),
  setShowPostLikingUsersModal: (showPostLikingUsersModal: boolean) =>
    dispatch(setShowPostLikingUsersModal(showPostLikingUsersModal)),
  setFeedPagePostModalShow: (feedPagePostModalShow: boolean) =>
    dispatch(setFeedPagePostModalShow(feedPagePostModalShow)),
  setFeedPagePostOptionsModalShow: (feedPagePostOptionsModalShow: boolean) =>
    dispatch(setFeedPagePostOptionsModalShow(feedPagePostOptionsModalShow)),
  setClearFeedPagePostModalState: (clearFeedPagePostModalState: boolean) =>
    dispatch(setClearFeedPagePostModalState(clearFeedPagePostModalState)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);
