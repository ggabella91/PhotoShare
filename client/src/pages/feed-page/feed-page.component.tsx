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
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearFollowPhotoFileArray,
  clearPostState,
} from '../../redux/post/post.actions';

import {
  Follower,
  FollowError,
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

import FeedPostContainer from '../../components/feed-post-container/feed-post-container.component';

import { prepareUserInfoAndFileArray } from './feed-page.utils';
import './feed-page.styles.scss';

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
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  clearPostState: typeof clearPostState;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  getOtherUserStart: typeof getOtherUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
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

      // This assumes that properties in the dataFeedMapArray's
      // objects were successfully changed
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

        // This assumes that properties in the dataFeedMapArray's
        // objects were successfully changed
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  clearPostState: () => dispatch(clearPostState()),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  getOtherUserStart: (otherUserRequest: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserRequest)),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearFollowState: () => dispatch(clearFollowState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPage);
