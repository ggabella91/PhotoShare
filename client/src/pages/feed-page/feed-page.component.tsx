import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

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
  PostDataReq,
  PostFileReq,
  PostFile,
  PostError,
  ArchivePostReq,
  UserType,
  PostMetaData,
} from '../../redux/post/post.types';
import {
  selectPostDataFeedArray,
  selectPostFiles,
  selectFollowPhotoFileArray,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
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
} from '../../components/feed-post-container/feed-post-container.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';

import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import { prepareUserInfoAndFileArray } from './feed-page.utils';
import './feed-page.styles.scss';
import { userInfo } from 'os';

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
  getPostDataConfirm: string | null;
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
  feedPagePostModalData: PostModalDataToFeed | null;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
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
  getPostDataConfirm,
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
  setFeedPagePostModalShow,
  setFeedPagePostOptionsModalShow,
  setClearFeedPagePostModalState,
}) => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    username: '',
    bio: '',
  });

  const [usersFollowingArray, setUsersFollowingArray] =
    useState<Follower[] | null>(null);

  const [followingInfoArray, setFollowingInfoArray] =
    useState<User[] | null>(null);

  const [dataFeedMapArray, setDataFeedMapArray] =
    useState<PostDataArrayMap[] | null>(null);

  const [followingProfilePhotoArray, setFollowingProfilePhotoArray] =
    useState<PostFile[] | null>(null);

  const [postFileFeedArray, setPostFileFeedArray] =
    useState<PostFile[] | null>(null);

  const [userInfoAndPostFileArray, setUserInfoAndPostFileArray] =
    useState<UserInfoAndPostFile[] | null>(null);

  const [pageToFetch, setPageToFetch] = useState(1);

  const [postLikersArray, setPostLikersArray] =
    useState<UserInfoAndOtherData[] | null>(null);

  const [postModalProps, setPostModalProps] = useState<PostModalDataToFeed>({
    id: '',
    postPhotoFileString: '',
    caption: '',
    location: '',
    date: '',
    profilePhotoFileString: '',
    postUserId: '',
    postUserName: '',
  });

  const [isPostModalDataFetched, setIsPostModalDataFetched] = useState(false);

  const [showLikingUsersModal, setShowLikingUsersModal] = useState(false);

  const [postModalShow, setPostModalShow] = useState(false);

  const [clearPostModalState, setClearPostModalState] = useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [currentUserPost, setCurrentUserPost] = useState<boolean | null>(null);

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (currentUser && !user.name) {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();

      setUser({
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio || '',
      });
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUserUsersFollowing) {
      setUsersFollowingArray(currentUserUsersFollowing);
    } else {
      setUsersFollowingArray(null);
    }
  }, [currentUserUsersFollowing]);

  useEffect(() => {
    if (usersFollowingArray) {
      for (let user of usersFollowingArray) {
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
      }
    }
  }, [usersFollowingArray]);

  useEffect(() => {
    if (postMetaDataForUser && dataFeedMapArray) {
      for (let el of dataFeedMapArray) {
        if (postMetaDataForUser.userId === el.userId) {
          el.queryLength = postMetaDataForUser.queryLength;
        }
      }

      setDataFeedMapArray(dataFeedMapArray);
    }
  }, [postMetaDataForUser]);

  useEffect(() => {
    if (pageToFetch > 1 && dataFeedMapArray) {
      for (let el of dataFeedMapArray) {
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
      }
    }
  }, [pageToFetch, dataFeedMapArray]);

  useEffect(() => {
    if (postDataFeedArray.length) {
      if (dataFeedMapArray) {
        for (let el of postDataFeedArray) {
          for (let mapEl of dataFeedMapArray) {
            if (el[0].userId === mapEl.userId) {
              mapEl.postData = el;
            }
          }
        }

        setDataFeedMapArray(dataFeedMapArray);
      } else {
        let dataMapArray: PostDataArrayMap[] = [];

        for (let el of postDataFeedArray) {
          dataMapArray.push({ postData: el, userId: el[0].userId });
        }

        setDataFeedMapArray(dataMapArray);
      }
    }
  }, [postDataFeedArray]);

  useEffect(() => {
    if (followingInfo) {
      setFollowingInfoArray(followingInfo);
    }
  }, [followingInfo]);

  useEffect(() => {
    if (currentUser && followingInfoArray) {
      for (let el of followingInfoArray) {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket: profileBucket,
            user: UserType.followArray,
          });
        }
      }
    }
  }, [followingInfoArray]);

  useEffect(() => {
    if (currentUser && dataFeedMapArray) {
      for (let innerObj of dataFeedMapArray) {
        for (let el of innerObj.postData) {
          getPostFileStart({
            s3Key: el.s3Key,
            bucket: postsBucket,
            user: UserType.other,
          });
        }
      }
    }
  }, [dataFeedMapArray, getPostDataConfirm]);

  useEffect(() => {
    if (followPhotoFileArray) {
      setFollowingProfilePhotoArray(followPhotoFileArray);
    }
  }, [followPhotoFileArray]);

  useEffect(() => {
    setPostFileFeedArray(postFiles);
  }, [postFiles]);

  useEffect(() => {
    if (
      followingInfoArray &&
      dataFeedMapArray &&
      followingProfilePhotoArray &&
      postFileFeedArray
    ) {
      let postDataArray: Post[][] = [];

      for (let el of dataFeedMapArray) {
        postDataArray.push(el.postData);
      }

      const userInfoAndPostObjArray = prepareUserInfoAndFileArray(
        followingInfoArray,
        postDataArray,
        followingProfilePhotoArray,
        postFileFeedArray
      );

      const sortedUserInfoAndPostArray = userInfoAndPostObjArray.sort(
        (a, b) => b.dateInt - a.dateInt
      );

      setUserInfoAndPostFileArray(sortedUserInfoAndPostArray);
    }
  }, [
    followingInfoArray,
    dataFeedMapArray,
    followingProfilePhotoArray,
    postFileFeedArray,
    getPostDataConfirm,
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
    if (postLikingUsersArray) {
      setPostLikersArray(postLikingUsersArray);
    }
  }, [postLikingUsersArray]);

  useEffect(() => {
    if (feedPagePostModalData && !isPostModalDataFetched) {
      console.log(feedPagePostModalData);
      setPostModalProps(feedPagePostModalData);
      setIsPostModalDataFetched(true);
    } else {
      console.log('No feedPagePostModalData found...');
    }
  }, [feedPagePostModalData]);

  useEffect(() => {
    setShowLikingUsersModal(showPostLikingUsersModal);
  }, [showPostLikingUsersModal]);

  useEffect(() => {
    setPostModalShow(feedPagePostModalShow);
  }, [feedPagePostModalShow]);

  useEffect(() => {
    setClearPostModalState(clearFeedPagePostModalState);
  }, [clearFeedPagePostModalState]);

  useEffect(() => {
    setPostOptionsModalShow(feedPagePostOptionsModalShow);
  }, [feedPagePostOptionsModalShow]);

  const handleHidePostModal = () => {
    setPostModalProps({
      id: '',
      postPhotoFileString: '',
      caption: '',
      location: '',
      date: '',
      profilePhotoFileString: '',
      postUserId: '',
      postUserName: '',
    });

    setFeedPagePostModalShow(false);
    setClearFeedPagePostModalState(true);
  };

  useEffect(() => {
    handleSetIsCurrentUserPost();
  }, [postModalProps]);

  const handleSetIsCurrentUserPost = () => {
    if (currentUser && postModalProps.postUserId) {
      if (postModalProps.postUserId === user.id) {
        setCurrentUserPost(true);
      } else {
        setCurrentUserPost(false);
      }
    }
  };

  // TODO: Add logic to get s3Key of a post to send archive requests when a feed-post-container has data for a post belonging to the current user

  // TODO: Add post-comment-options-modal component, add state and effects need to organize and feed necessary data to it, add logic to determine when to render this when interacting with a particular comment within a feed-post-container component in this page

  return (
    <div className='feed-page'>
      {userInfoAndPostFileArray && userInfoAndPostFileArray.length ? (
        userInfoAndPostFileArray.map((el, idx) => {
          if (idx === userInfoAndPostFileArray.length - 1) {
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
      {feedPagePostModalData ? (
        <PostModal
          postId={postModalProps.id}
          show={postModalShow}
          fileString={postModalProps.postPhotoFileString}
          caption={feedPagePostModalData.caption}
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
      ) : null}
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={() => setFeedPagePostOptionsModalShow(false)}
        isCurrentUserPostOrComment={currentUserPost}
        archive={() =>
          archivePostStart({
            postId: postModalProps.id,
            s3Key: '', // see one of the above TODO items
          })
        }
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
  getPostDataConfirm: string | null;
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
  feedPagePostModalData: PostModalDataToFeed | null;
  feedPagePostModalShow: boolean;
  feedPagePostOptionsModalShow: boolean;
  clearFeedPagePostModalState: boolean;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postDataFeedArray: selectPostDataFeedArray,
  postFiles: selectPostFiles,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
  getPostDataConfirm: selectGetPostDataConfirm,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);
