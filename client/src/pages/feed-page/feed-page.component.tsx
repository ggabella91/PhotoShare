import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';

import { AppState } from '../../redux/root-reducer';

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
} from '../../redux/post/post.types';
import {
  selectPostDataFeedArray,
  selectFollowPhotoFileArray,
  selectPostError,
  selectPostConfirm,
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

import {
  prepareUserInfoAndFileArray,
  comparePostFileArrays,
  compareUserInfoAndDataObjArrays,
} from './feed-page.utils';
import './feed-page.styles.scss';

interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export type UserLite = ImmutableMap<{
  id: string;
  name: string;
  username: string;
  bio: string;
}>;

export interface PostDataArrayMap {
  postData: Post[];
  queryLength?: number;
  userId: string;
}

export interface UserInfoAndPostFile {
  profilePhotoFileString: string;
  username: string;
  userId: string;
  location: string;
  postId: string;
  postS3Key: string;
  postFileString: string;
  caption?: string;
  dateString: string;
  dateInt: number;
}

interface FeedPageProps {
  currentUser: User | null;
  postDataFeedArray: Post[][];
  postFiles: PostFile[];
  postConfirm: string | null;
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
  clearFeedPagePostModalState,
  showCommentOptionsModal,
  commentToDelete,
  setFeedPagePostModalShow,
  setFeedPagePostOptionsModalShow,
  setClearFeedPagePostModalState,
  setShowCommentOptionsModal,
  deleteReactionStart,
}) => {
  const [user, setUser] = useState<UserLite>(
    Map({
      id: '',
      name: '',
      username: '',
      bio: '',
    })
  );

  const [usersFollowingArray, setUsersFollowingArray] =
    useState<List<Follower> | null>(null);

  const [followingInfoArray, setFollowingInfoArray] =
    useState<List<User> | null>(null);

  const [dataFeedMapArray, setDataFeedMapArray] =
    useState<List<PostDataArrayMap> | null>(null);

  const [followingProfilePhotoArray, setFollowingProfilePhotoArray] = useState<
    PostFile[] | null
  >(null);

  const [postFileFeedArray, setPostFileFeedArray] = useState<PostFile[] | null>(
    null
  );

  const [userInfoAndPostFileList, setUserInfoAndPostFileList] =
    useState<List<UserInfoAndPostFile> | null>(null);

  const [pageToFetch, setPageToFetch] = useState(1);

  const [postLikersArray, setPostLikersArray] = useState<
    UserInfoAndOtherData[] | null
  >(null);

  const [postModalProps, setPostModalProps] = useState<PostModalDataToFeed>(
    POST_MODAL_DATA_INITIAL_STATE
  );

  const [showLikingUsersModal, setShowLikingUsersModal] = useState(false);

  const [postModalShow, setPostModalShow] = useState(false);

  const [clearPostModalState, setClearPostModalState] = useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [currentUserPost, setCurrentUserPost] = useState<boolean | null>(null);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] = useState<
    boolean | null
  >(null);

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    let currentUserMap;
    if (currentUser) {
      currentUserMap = Map(currentUser);
    } else {
      return;
    }

    if (!user.equals(currentUserMap)) {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();

      setUser(
        Map({
          id: currentUserMap.get('id'),
          name: currentUserMap.get('name'),
          username: currentUserMap.get('username'),
          bio: currentUserMap.get('bio') || '',
        })
      );
      getUsersFollowingStart({
        userId: currentUserMap.get('id')!,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    let currentUserUsersFollowingList;

    if (currentUserUsersFollowing) {
      currentUserUsersFollowingList = List(currentUserUsersFollowing);
    } else {
      setUsersFollowingArray(null);
      return;
    }

    if (!usersFollowingArray) {
      setUsersFollowingArray(currentUserUsersFollowingList);
    } else if (
      usersFollowingArray &&
      !usersFollowingArray.equals(currentUserUsersFollowingList)
    ) {
      setUsersFollowingArray(currentUserUsersFollowingList);
    }
  }, [currentUserUsersFollowing]);

  useEffect(() => {
    if (usersFollowingArray) {
      usersFollowingArray.forEach((user) => {
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
    }
  }, [usersFollowingArray]);

  useEffect(() => {
    if (postMetaDataForUser && dataFeedMapArray) {
      dataFeedMapArray.forEach((el) => {
        if (postMetaDataForUser.userId === el.userId) {
          el.queryLength = postMetaDataForUser.queryLength;
        }
      });

      setDataFeedMapArray(dataFeedMapArray);
    }
  }, [postMetaDataForUser]);

  useEffect(() => {
    if (pageToFetch > 1 && dataFeedMapArray) {
      dataFeedMapArray.forEach((el) => {
        if (
          el.queryLength &&
          currentUser &&
          pageToFetch <= el.queryLength / 2
        ) {
          getPostDataStart({
            userId: el.userId,
            dataReqType: DataRequestType.feed,
            pageToShow: pageToFetch,
            limit: 2,
          });
        }
      });
    }
  }, [pageToFetch, dataFeedMapArray]);

  useEffect(() => {
    if (postDataFeedArray.length) {
      if (dataFeedMapArray) {
        postDataFeedArray.forEach((el) => {
          dataFeedMapArray.forEach((mapEl) => {
            if (el[0].userId === mapEl.userId) {
              mapEl.postData = el;
            }
          });
        });

        setDataFeedMapArray(dataFeedMapArray);
      } else {
        let dataMapArray: PostDataArrayMap[] = [];

        postDataFeedArray.forEach((el) => {
          dataMapArray.push({ postData: el, userId: el[0].userId });
        });

        const dataMapList = List(dataMapArray);

        setDataFeedMapArray(dataMapList);
      }
    }
  }, [postDataFeedArray]);

  useEffect(() => {
    let followInfoList: List<User>;

    if (followingInfo) {
      followInfoList = List(followingInfo);
    } else {
      return;
    }

    if (!followingInfoArray) {
      setFollowingInfoArray(followInfoList);
    } else if (
      followingInfoArray &&
      !followingInfoArray.equals(followInfoList)
    ) {
      setFollowingInfoArray(followInfoList);
    }
  }, [followingInfo]);

  useEffect(() => {
    if (currentUser && followingInfoArray) {
      followingInfoArray.forEach((el) => {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket: profileBucket,
            user: UserType.followArray,
            fileRequestType: FileRequestType.feedPost,
          });
        }
      });
    }
  }, [followingInfoArray]);

  useEffect(() => {
    if (currentUser && dataFeedMapArray) {
      dataFeedMapArray.forEach((innerObj) => {
        innerObj.postData.forEach((el) => {
          getPostFileStart({
            s3Key: el.s3Key,
            bucket: postsBucket,
            user: UserType.other,
            fileRequestType: FileRequestType.feedPost,
          });
        });
      });
    }
  }, [dataFeedMapArray, getFeedPostDataConfirm]);

  useEffect(() => {
    if (followPhotoFileArray && !followingProfilePhotoArray) {
      setFollowingProfilePhotoArray(followPhotoFileArray);
    } else if (
      followPhotoFileArray &&
      followingProfilePhotoArray &&
      !comparePostFileArrays(followPhotoFileArray, followingProfilePhotoArray)
    ) {
      setFollowingProfilePhotoArray(followPhotoFileArray);
    }
  }, [followPhotoFileArray]);

  useEffect(() => {
    if (postFiles && !postFileFeedArray) {
      setPostFileFeedArray(postFiles);
    } else if (
      postFiles &&
      postFileFeedArray &&
      !comparePostFileArrays(postFiles, postFileFeedArray)
    ) {
      setPostFileFeedArray(postFiles);
    }
  }, [postFiles]);

  useEffect(() => {
    if (
      followingInfoArray &&
      dataFeedMapArray &&
      followingProfilePhotoArray &&
      postFileFeedArray
    ) {
      let postDataArray: Post[][] = [];

      dataFeedMapArray.forEach((el) => {
        postDataArray.push(el.postData);
      });

      const userInfoAndPostObjArray = prepareUserInfoAndFileArray(
        followingInfoArray,
        postDataArray,
        followingProfilePhotoArray,
        postFileFeedArray
      );

      const sortedUserInfoAndPostArray = userInfoAndPostObjArray.sort(
        (a, b) => b.dateInt - a.dateInt
      );

      const sortedUserInfoAndPostList = List(sortedUserInfoAndPostArray);

      if (
        userInfoAndPostFileList &&
        userInfoAndPostFileList.equals(sortedUserInfoAndPostList)
      ) {
        return;
      }

      setUserInfoAndPostFileList(sortedUserInfoAndPostList);
    }
  }, [
    followingInfoArray,
    dataFeedMapArray,
    followingProfilePhotoArray,
    postFileFeedArray,
    getFeedPostDataConfirm,
  ]);

  const observer = useRef<IntersectionObserver>();

  const lastPostContainerElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingPostData) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageToFetch(pageToFetch + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingPostData]
  );

  useEffect(() => {
    if (
      postLikingUsersArray &&
      !(
        postLikersArray &&
        compareUserInfoAndDataObjArrays(postLikingUsersArray, postLikersArray)
      )
    ) {
      setPostLikersArray(postLikingUsersArray);
    }
  }, [postLikingUsersArray]);

  useEffect(() => {
    if (feedPagePostModalData.id) {
      setPostModalProps(feedPagePostModalData);
    }
  }, [feedPagePostModalData]);

  useEffect(() => {
    setShowLikingUsersModal(showPostLikingUsersModal);
  }, [showPostLikingUsersModal]);

  useEffect(() => {
    if (feedPagePostModalShow) {
      setPostModalShow(feedPagePostModalShow);
      setFeedPagePostModalShow(false);
    }
  }, [feedPagePostModalShow]);

  useEffect(() => {
    if (clearFeedPagePostModalState) {
      setClearPostModalState(clearFeedPagePostModalState);
    }
  }, [clearFeedPagePostModalState]);

  useEffect(() => {
    setPostOptionsModalShow(feedPagePostOptionsModalShow);
  }, [feedPagePostOptionsModalShow]);

  const handleHidePostModal = () => {
    setPostModalProps(POST_MODAL_DATA_INITIAL_STATE);
    setPostModalShow(false);
    setClearFeedPagePostModalState(true);
  };

  useEffect(() => {
    if (postModalProps.postUserId) {
      handleSetIsCurrentUserPost();
    }
  }, [postModalProps]);

  const handleSetIsCurrentUserPost = () => {
    if (currentUser && postModalProps.postUserId) {
      if (postModalProps.postUserId === user.get('id')) {
        setCurrentUserPost(true);
      } else {
        setCurrentUserPost(false);
      }
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
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

  const handleArchiveComment = () => {
    if (commentToDelete) {
      deleteReactionStart(commentToDelete);
    }
    setShowCommentOptionsModal(false);
  };

  return (
    <div className='feed-page'>
      {userInfoAndPostFileList && userInfoAndPostFileList.size ? (
        userInfoAndPostFileList.map((el, idx) => {
          if (idx === userInfoAndPostFileList.size - 1) {
            return (
              <FeedPostContainer
                userInfo={{
                  profilePhotoFileString: el.profilePhotoFileString,
                  username: el.username,
                  userId: el.userId,
                  postId: el.postId,
                  location: el.location,
                  name: '',
                  comment: '',
                }}
                s3Key={el.postS3Key}
                fileString={el.postFileString}
                caption={el.caption}
                date={el.dateString}
                key={Math.random()}
                custRef={lastPostContainerElementRef}
              />
            );
          } else {
            return (
              <FeedPostContainer
                userInfo={{
                  profilePhotoFileString: el.profilePhotoFileString,
                  username: el.username,
                  userId: el.userId,
                  postId: el.postId,
                  location: el.location,
                  name: '',
                  comment: '',
                }}
                s3Key={el.postS3Key}
                fileString={el.postFileString}
                caption={el.caption}
                date={el.dateString}
                key={Math.random()}
              />
            );
          }
        })
      ) : (
        <div className='no-franz'>
          Follow users to see their recent posts here
        </div>
      )}
      {postLikersArray ? (
        <FollowersOrFollowingOrLikesModal
          users={null}
          show={showLikingUsersModal}
          onHide={() => setShowPostLikingUsersModal(false)}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersArray={postLikersArray}
        />
      ) : null}
      <PostModal
        postId={postModalProps.id}
        show={postModalShow}
        fileString={postModalProps.postPhotoFileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={postModalProps.date || ''}
        onHide={() => handleHidePostModal()}
        onOptionsClick={() => setFeedPagePostOptionsModalShow(true)}
        onPostLikingUsersClick={() => setShowPostLikingUsersModal(true)}
        userProfilePhotoFile={postModalProps.profilePhotoFileString || ''}
        userName={postModalProps.postUserName}
        userId={postModalProps.postUserId}
        clearLocalState={clearPostModalState}
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={() => setFeedPagePostOptionsModalShow(false)}
        isCurrentUserPostOrComment={currentUserPost}
        archive={() =>
          archivePostStart({
            postId: postModalProps.id,
            s3Key: postModalProps.postS3Key,
          })
        }
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={() => setShowCommentOptionsModal(false)}
        archive={handleArchiveComment}
        isCurrentUserPostOrComment={currentUserPostOrComment}
      />
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postDataFeedArray: Post[][];
  postFiles: PostFile[];
  postConfirm: string | null;
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
  postConfirm: selectPostConfirm,
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
