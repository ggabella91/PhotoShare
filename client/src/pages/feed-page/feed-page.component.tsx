import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

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
  prepareUserInfoAndFileList,
  compareUserOrPostOrReactionLists,
  comparePostFileLists,
  compareUserInfoAndDataObjLists,
} from './feed-page.utils';
import './feed-page.styles.scss';

export interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export type UserLite = ImmutableMap<{
  id: string;
  name: string;
  username: string;
  bio: string;
}>;

export interface PostDataListMap {
  postData: List<Post>;
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

  const [usersFollowingList, setUsersFollowingList] = useState<List<Follower>>(
    List()
  );

  const [followingInfoList, setFollowingInfoList] = useState<List<User>>(
    List()
  );

  const [dataFeedMapList, setDataFeedMapList] = useState<List<PostDataListMap>>(
    List()
  );

  const [followingProfilePhotoList, setFollowingProfilePhotoList] = useState<
    List<PostFile>
  >(List());

  const [postFileFeedArray, setPostFileFeedArray] = useState<List<PostFile>>(
    List()
  );

  const [userInfoAndPostFileList, setUserInfoAndPostFileArray] = useState<
    List<UserInfoAndPostFile>
  >(List());

  const [pageToFetch, setPageToFetch] = useState(1);

  const [postLikersList, setPostLikersList] =
    useState<List<UserInfoAndOtherData> | null>(null);

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
    []
  );

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
      setUsersFollowingList(List());
      return;
    }

    if (!usersFollowingList.equals(currentUserUsersFollowingList)) {
      setUsersFollowingList(currentUserUsersFollowingList);
    }
  }, [currentUserUsersFollowing]);

  useEffect(() => {
    usersFollowingList.forEach((user) => {
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
  }, [usersFollowingList]);

  useEffect(() => {
    if (postMetaDataForUser) {
      const newDataFeedMapList = dataFeedMapList.map((el) => {
        if (postMetaDataForUser.userId === el.userId) {
          let elCopy = { ...el };
          elCopy.queryLength = postMetaDataForUser.queryLength;
          return elCopy;
        }

        return el;
      });

      setDataFeedMapList(newDataFeedMapList);
    }
  }, [postMetaDataForUser]);

  useEffect(() => {
    if (pageToFetch > 1) {
      dataFeedMapList.forEach((el) => {
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
  }, [pageToFetch, dataFeedMapList]);

  useEffect(() => {
    if (postDataFeedArray.length) {
      if (dataFeedMapList.size) {
        postDataFeedArray.forEach((el) => {
          dataFeedMapList.forEach((mapEl) => {
            if (el[0].userId === mapEl.userId) {
              mapEl.postData = List(el);
            }
          });
        });

        setDataFeedMapList(dataFeedMapList);
      } else {
        let dataMapList: List<PostDataListMap> = List();

        postDataFeedArray.forEach((el) => {
          dataMapList = dataMapList.push({
            postData: List(el),
            userId: el[0].userId,
          });
        });

        setDataFeedMapList(dataMapList);
      }
    }
  }, [postDataFeedArray]);

  useEffect(() => {
    let followingList;

    if (followingInfo) {
      followingList = List(followingInfo);
    } else {
      return;
    }

    if (!compareUserOrPostOrReactionLists(followingInfoList, followingList)) {
      setFollowingInfoList(followingList);
    }
  }, [followingInfo]);

  useEffect(() => {
    if (currentUser) {
      followingInfoList.forEach((el) => {
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
  }, [followingInfoList]);

  useEffect(() => {
    if (currentUser) {
      dataFeedMapList.forEach((innerObj) => {
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
  }, [dataFeedMapList, getFeedPostDataConfirm]);

  useEffect(() => {
    let followPhotoFileList;

    if (followPhotoFileArray) {
      followPhotoFileList = List(followPhotoFileArray);
    } else {
      return;
    }

    if (!comparePostFileLists(followingProfilePhotoList, followPhotoFileList)) {
      setFollowingProfilePhotoList(followPhotoFileList);
    }
  }, [followPhotoFileArray]);

  useEffect(() => {
    let postFilesList;

    if (postFiles) {
      postFilesList = List(postFiles);
    } else {
      return;
    }

    if (!comparePostFileLists(postFileFeedArray, postFilesList)) {
      setPostFileFeedArray(postFilesList);
    }
  }, [postFiles]);

  useEffect(() => {
    if (
      dataFeedMapList.size &&
      followingProfilePhotoList.size &&
      postFileFeedArray
    ) {
      let postDataMultiList: List<List<Post>> = List();

      dataFeedMapList.forEach((el) => {
        postDataMultiList = postDataMultiList.push(el.postData);
      });

      const userInfoAndPostObjList = prepareUserInfoAndFileList(
        followingInfoList,
        postDataMultiList,
        followingProfilePhotoList,
        postFileFeedArray
      );

      const sortedUserInfoAndPostList = userInfoAndPostObjList.sort(
        (a, b) => b.dateInt - a.dateInt
      );

      if (
        compareUserInfoAndDataObjLists(
          userInfoAndPostFileList,
          sortedUserInfoAndPostList
        )
      ) {
        return;
      }

      setUserInfoAndPostFileArray(sortedUserInfoAndPostList);
    }
  }, [
    followingInfoList,
    dataFeedMapList,
    followingProfilePhotoList,
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
    let postLikingUsersList;

    if (postLikingUsersArray) {
      postLikingUsersList = List(postLikingUsersArray);
    } else {
      return;
    }

    if (!(postLikersList && postLikersList.equals(postLikingUsersList))) {
      setPostLikersList(postLikingUsersList);
    }
  }, [postLikingUsersArray]);

  useEffect(() => {
    if (feedPagePostModalData.id) {
      setPostModalProps(feedPagePostModalData);
    }
  }, [feedPagePostModalData.id]);

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
    if (clearPostModalState) {
      setClearPostModalState(false);
    }
  }, [clearPostModalState]);

  useEffect(() => {
    setPostOptionsModalShow(feedPagePostOptionsModalShow);
  }, [feedPagePostOptionsModalShow]);

  const handleHidePostModal = () => {
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
      {isLoadingPostData ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : null}
      {userInfoAndPostFileList.size && !isLoadingPostData
        ? userInfoAndPostFileList.map((el, idx) => (
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
              key={el.postId}
              custRef={
                idx === userInfoAndPostFileList.size - 1
                  ? lastPostContainerElementRef
                  : null
              }
            />
          ))
        : null}
      {currentUserUsersFollowing && !currentUserUsersFollowing.length ? (
        <div className='no-franz'>
          Follow users to see their recent posts here
        </div>
      ) : null}
      {postLikersList ? (
        <FollowersOrFollowingOrLikesModal
          users={null}
          show={showLikingUsersModal}
          onHide={() => setShowPostLikingUsersModal(false)}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersList={postLikersList}
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
