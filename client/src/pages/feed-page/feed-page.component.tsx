import React, { useState, useEffect } from 'react';
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
  ArchivePostReq,
  PostFile,
  PostError,
  UserType,
} from '../../redux/post/post.types';
import {
  selectPostDataFeedArray,
  selectPostFiles,
  selectUsersProfilePhotoFileArray,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearUsersPhotoFileArray,
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

export interface UserInfoAndPostFile {
  profilePhotoFileString: string;
  username: string;
  location: string;
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
  usersProfilePhotoFileArray: PostFile[] | null;
  getUsersFollowingConfirm: string | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  clearPostState: typeof clearPostState;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  getOtherUserStart: typeof getOtherUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
}

const FeedPage: React.FC<FeedPageProps> = ({
  currentUser,
  postDataFeedArray,
  postFiles,
  currentUserUsersFollowing,
  followingInfo,
  usersProfilePhotoFileArray,
  getPostDataStart,
  getPostFileStart,
  clearPostState,
  getUsersFollowingStart,
  getOtherUserStart,
  clearFollowersAndFollowing,
  clearFollowState,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });

  const [usersFollowingArray, setUsersFollowingArray] = useState<
    Follower[] | null
  >(null);

  const [followingInfoArray, setFollowingInfoArray] = useState<User[] | null>(
    null
  );

  const [totalNumberOfPosts, setTotalNumberOfPosts] = useState(0);

  const [dataFeedArray, setDataFeedArray] = useState<Post[][] | null>(null);

  const [followingProfilePhotoArray, setFollowingProfilePhotoArray] = useState<
    PostFile[] | null
  >(null);

  const [postFileFeedArray, setPostFileFeedArray] = useState<PostFile[] | null>(
    null
  );

  const [userInfoAndPostFileArray, setUserInfoAndPostFileArray] = useState<
    UserInfoAndPostFile[] | null
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
        getOtherUserStart({
          usernameOrId: user.userId,
          type: OtherUserType.FOLLOWING,
        });

        getPostDataStart({
          userId: user.userId,
          dataReqType: DataRequestType.feed,
        });
      }
    }
  }, [usersFollowingArray]);

  useEffect(() => {
    if (postDataFeedArray.length) {
      setDataFeedArray(postDataFeedArray);
    }
  }, [postDataFeedArray]);

  useEffect(() => {
    if (followingInfo) {
      setFollowingInfoArray(followingInfo);
    }
  }, [followingInfo]);

  useEffect(() => {
    if (followingInfoArray) {
      for (let el of followingInfoArray) {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket: profileBucket,
            user: UserType.usersArray,
          });
        }
      }
    }
  }, [followingInfoArray]);

  useEffect(() => {
    if (dataFeedArray) {
      if (totalNumberOfPosts !== 0) {
        setTotalNumberOfPosts(0);
      }

      for (let innerArray of dataFeedArray) {
        console.log('innerArray length: ', innerArray.length);
        console.log('totalNumberOfPosts: ', totalNumberOfPosts);
        setTotalNumberOfPosts(totalNumberOfPosts + innerArray.length);
        console.log(totalNumberOfPosts + innerArray.length);

        for (let el of innerArray) {
          getPostFileStart({
            s3Key: el.s3Key,
            bucket: postsBucket,
            user: UserType.other,
          });
        }
      }
    }
  }, [dataFeedArray]);

  useEffect(() => {
    if (usersProfilePhotoFileArray) {
      setFollowingProfilePhotoArray(usersProfilePhotoFileArray);
    }
  }, [usersProfilePhotoFileArray]);

  useEffect(() => {
    if (postFiles.length === totalNumberOfPosts) {
      setPostFileFeedArray(postFiles);
    }
  }, [postFiles]);

  useEffect(() => {
    if (
      followingInfoArray &&
      dataFeedArray &&
      followingProfilePhotoArray &&
      postFileFeedArray
    ) {
      const userInfoAndPostObjArray = prepareUserInfoAndFileArray(
        followingInfoArray,
        dataFeedArray,
        followingProfilePhotoArray,
        postFileFeedArray
      );

      // let userInfoAndPostObjArray: UserInfoAndPostFile[] = postFileFeedArray.map(
      //   (el) => {
      //     let location: string;
      //     let dateString: string;
      //     let dateInt: number;
      //     let id: string;
      //     let username: string;
      //     let photoS3Key: string;
      //     let profilePhotoString: string;
      //     let caption: string;

      //     for (let innerArr of dataFeedArray) {
      //       for (let innerEl of innerArr) {
      //         if (innerEl.s3Key === el.s3Key) {
      //           location = innerEl.postLocation || '';
      //           id = innerEl.userId;
      //           caption = innerEl.caption || '';
      //           dateString = new Date(innerEl.createdAt).toDateString();
      //           dateInt = innerEl.createdAt.getTime();
      //         }
      //       }
      //     }

      //     for (let userEl of followingInfoArray) {
      //       if (userEl.id === id!) {
      //         username = userEl.username;
      //         photoS3Key = userEl.photo || '';
      //       }
      //     }

      //     for (let userEl of followingProfilePhotoArray) {
      //       if (photoS3Key! && userEl.s3Key === photoS3Key) {
      //         profilePhotoString = userEl.fileString;
      //       }
      //     }

      //     if (!profilePhotoString!) {
      //       profilePhotoString = '';
      //     }
      //     if (!location!) {
      //       location = '';
      //     }

      //     if (!caption!) {
      //       caption = '';
      //     }

      //     if (!dateString!) {
      //       dateString = '';
      //     }

      //     if (!dateInt!) {
      //       dateInt = Date.now();
      //     }

      //     return {
      //       username: username!,
      //       profilePhotoFileString: profilePhotoString,
      //       location,
      //       postFileString: el.fileString,
      //       caption,
      //       dateString,
      //       dateInt,
      //     };
      //   }
      // );

      const sortedUserInfoAndPostArray = userInfoAndPostObjArray.sort(
        (a, b) => b.dateInt - a.dateInt
      );

      setUserInfoAndPostFileArray(sortedUserInfoAndPostArray);
    }
  }, [
    followingInfoArray,
    dataFeedArray,
    followingProfilePhotoArray,
    postFileFeedArray,
  ]);

  useEffect(() => {
    console.log('followingInfoArray: ', followingInfoArray);
    console.log('dataFeedArray: ', dataFeedArray);
    console.log('followingProfilePhotoArray: ', followingProfilePhotoArray);
    console.log('postFileFeedArray: ', postFileFeedArray);
    console.log(
      'postFiles.length: ',
      postFiles.length,
      'totalNumberOfPosts: ',
      totalNumberOfPosts
    );
  }, [
    followingInfoArray,
    dataFeedArray,
    followingProfilePhotoArray,
    postFileFeedArray,
    postFileFeedArray,
    postFiles,
    totalNumberOfPosts,
  ]);

  return (
    <div className='feed-page'>
      {userInfoAndPostFileArray && userInfoAndPostFileArray.length ? (
        userInfoAndPostFileArray.map((el) => (
          <FeedPostContainer
            userInfo={{
              profilePhotoFileString: el.profilePhotoFileString,
              username: el.username,
              location: el.location,
              name: '',
            }}
            fileString={el.postFileString}
            date={el.dateString}
          />
        ))
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
  usersProfilePhotoFileArray: PostFile[] | null;
  getUsersFollowingConfirm: string | null;
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
  usersProfilePhotoFileArray: selectUsersProfilePhotoFileArray,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
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
