import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

import { AppState } from '../../redux/root-reducer';

import { useLazyLoading } from '../../hooks';

import { OtherUserType, OtherUserRequest } from '../../redux/user/user.types';
import {
  getOtherUserStart,
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
  clearOtherUser,
} from '../../redux/user/user.actions';

import {
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  PostFile,
  UserType,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import { selectPostLikingUsersArray } from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearFollowPhotoFileArray,
  clearPostFilesAndData,
  setShowCommentOptionsModal,
  deleteReactionStart,
  clearPostState,
  clearPostMetaDataForUser,
} from '../../redux/post/post.actions';

import {
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';

import {
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  clearFollowState,
  postNotificationStart,
  setIsFollowersModal,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import NotFoundPage from '../../pages/not-found/not-found-page.component';
import UnfollowModal from '../../components/unfollow-modal/unfollow-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import '../my-profile/profile-page.styles.scss';
import { PostModalMapProps } from '../my-profile/my-profile-page.component';

export interface UserLite {
  id: string;
  name: string;
  username: string;
  bio: string;
}

interface UserProfilePageProps {
  username: string;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  clearFollowPhotoFileArray: typeof clearFollowPhotoFileArray;
  getOtherUserStart: typeof getOtherUserStart;
  followNewUserStart: typeof followNewUserStart;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  unfollowUserStart: typeof unfollowUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearPostFilesAndData: typeof clearPostFilesAndData;
  clearFollowState: typeof clearFollowState;
  setIsCurrentUserProfilePage: typeof setIsCurrentUserProfilePage;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  deleteReactionStart: typeof deleteReactionStart;
  clearPostState: typeof clearPostState;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  username,
  getOtherUserStart,
  getPostDataStart,
  getPostFileStart,
  clearFollowPhotoFileArray,
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  clearFollowersAndFollowing,
  clearPostFilesAndData,
  clearFollowState,
  setIsCurrentUserProfilePage,
  setShowCommentOptionsModal,
  deleteReactionStart,
  clearPostState,
}) => {
  const [profilePhotoString, setProfilePhoto] = useState<string>('');

  const [isFollowing, setIsFollowing] = useState(false);

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState<PostModalMapProps>({
    id: '',
    s3Key: '',
    caption: '',
    location: null,
    createdAt: null,
    fileString: '',
    isVideo: false,
  });

  const [clearPostModalLocalState, setClearPostModalLocalState] =
    useState(false);

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [unfollowModalShow, setUnfollowModalShow] = useState(false);

  const [followersOrFollowingModalShow, setFollowersOrFollowingModalShow] =
    useState(false);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] =
    useState<boolean>(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [pageToFetch, setPageToFetch] = useState(1);

  let isInitialPostDataFetched = useRef(false);

  const postState = useSelector((state: AppState) => state.post);
  const userState = useSelector((state: AppState) => state.user);
  const followerState = useSelector((state: AppState) => state.follower);

  const {
    postData,
    postFiles,
    postMetaDataForUser,
    isLoadingPostData,
    getPostDataConfirm,
    profilePhotoFile,
    commentToDelete,
    showCommentOptionsModal,
    postLikingUsersArray,
  } = postState;
  const { currentUser, otherUser, otherUserError, isCurrentUserProfilePage } =
    userState;
  const {
    followers,
    currentUserUsersFollowing,
    otherUserUsersFollowing,
    followConfirm,
    unfollowConfirm,
    getUsersFollowingConfirm,
  } = followerState;

  const { intersectionCounter, observedElementRef } =
    useLazyLoading(isLoadingPostData);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    clearPostState();
    clearFollowState();
    clearFollowersAndFollowing();
    setIsCurrentUserProfilePage(false);

    // Clear post state and follow state when cleaning
    // up before component leaves the screen
    return () => {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();
      dispatch(clearOtherUser());
      dispatch(clearPostMetaDataForUser());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isCurrentUserProfilePage) {
      setIsCurrentUserProfilePage(false);
    }
    setFollowersOrFollowingModalShow(false);
    dispatch(clearOtherUser());
    clearFollowersAndFollowing();
    clearPostFilesAndData();
    isInitialPostDataFetched.current = false;

    getOtherUserStart({ type: OtherUserType.OTHER, usernameOrId: username });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, isCurrentUserProfilePage]);

  useEffect(() => {
    if (currentUser) {
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
      if (otherUser) {
        getFollowersStart(otherUser.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followConfirm]);

  useEffect(() => {
    if (otherUser) {
      getFollowersStart(otherUser.id);
      getUsersFollowingStart({
        userId: otherUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.OTHER_USER,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser]);

  useEffect(() => {
    if (
      otherUser &&
      otherUser.username === username &&
      otherUser.id &&
      !isInitialPostDataFetched.current
    ) {
      isInitialPostDataFetched.current = true;
      getPostDataStart({
        userId: otherUser.id,
        dataReqType: DataRequestType.single,
        pageToShow: pageToFetch,
        limit: 9,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!profilePhotoFile && otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
        fileRequestType: FileRequestType.singlePost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUser]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setProfilePhoto(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (
      postMetaDataForUser &&
      intersectionCounter > 1 &&
      pageToFetch + 1 <= Math.ceil(postMetaDataForUser.queryLength / 9) &&
      otherUser &&
      postData &&
      postData.length === postFiles.length
    ) {
      getPostDataStart({
        userId: otherUser.id,
        dataReqType: DataRequestType.single,
        pageToShow: pageToFetch + 1,
        limit: 9,
      });

      setPageToFetch(pageToFetch + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectionCounter]);

  useEffect(() => {
    if (otherUser && postData) {
      postData.forEach((post) => {
        getPostFileStart({
          s3Key: post.s3Key,
          isVideo: post.isVideo,
          videoThumbnailS3Key: post.videoThumbnailS3Key,
          bucket: postsBucket,
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData]);

  const postFileArray = useMemo(() => {
    if (postData && postFiles.length >= postData.length) {
      let orderedFiles: PostFile[] = [];

      postData.forEach((post) => {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles.push(fileMatch);
        }
      });

      return orderedFiles;
    }
  }, [postData, postFiles]);

  const handleRenderPostModal = (event: React.MouseEvent<HTMLDivElement>) => {
    const overlayDivElement = event.target as HTMLElement;
    const postS3Key = overlayDivElement.dataset.s3key || '';

    const data = postData?.find((el) => el.s3Key === postS3Key);
    const postFileString =
      postFileArray?.find((el) => el.s3Key === postS3Key)?.fileString || '';

    if (data) {
      const caption = data.caption || '';
      const location = data.postLocation || null;
      const { createdAt } = data;

      setPostModalProps({
        id: data.id,
        caption,
        s3Key: postS3Key,
        location,
        createdAt,
        fileString: postFileString,
        isVideo: data.isVideo,
      });
      setClearPostModalLocalState(false);
      setPostModalShow(true);
    }
  };

  const handleHidePostModal = () => {
    setPostModalProps({
      id: '',
      s3Key: '',
      caption: '',
      location: null,
      createdAt: null,
      fileString: '',
      isVideo: false,
    });
    setPostModalShow(false);
    setClearPostModalLocalState(true);
  };

  const handlePostOptionsClick = () => setPostOptionsModalShow(true);

  const handlePostLikingUsersClick = () => setShowPostLikingUsersModal(true);

  const handleClickFollowOrFollowingButton = () => {
    if (isFollowing) {
      setUnfollowModalShow(true);
    } else if (otherUser) {
      followNewUserStart(otherUser.id);

      if (currentUser) {
        dispatch(
          postNotificationStart({
            fromUserId: otherUser.id,
            toUserId: currentUser.id,
            message: `${currentUser?.username} started following you.`,
          })
        );
      }
    }
  };

  useEffect(() => {
    handleDetermineIfFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUsersFollowingConfirm]);

  const handleDetermineIfFollowing = () => {
    if (currentUserUsersFollowing && currentUserUsersFollowing.length) {
      for (let userFollowing of currentUserUsersFollowing) {
        if (userFollowing.userId === otherUser?.id) {
          setIsFollowing(true);
          return;
        }
      }

      setIsFollowing(false);
      return;
    }
  };

  useEffect(() => {
    if (unfollowConfirm) {
      setIsFollowing(false);
      getFollowersStart(otherUser!.id);
      clearFollowState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unfollowConfirm]);

  const handleRenderFollowOrFollowingButton = (narrow: boolean) => {
    return (
      <button
        className={narrow ? 'follow-profile-narrow-screen' : 'follow-profile'}
      >
        <span
          className={narrow ? 'follow-narrow-text' : 'follow-text'}
          onClick={handleClickFollowOrFollowingButton}
        >
          {isFollowing! ? 'Following' : 'Follow'}
        </span>
      </button>
    );
  };

  const handleRenderFollowersModal = () => {
    if (followers?.length) {
      dispatch(setIsFollowersModal(true));
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleRenderFollowingModal = () => {
    if (otherUserUsersFollowing?.length) {
      dispatch(setIsFollowersModal(false));
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleMakeStatClickable = (type: string, baseClassName: string) => {
    if (type === 'followers') {
      return followers?.length
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    } else if (type === 'following') {
      return otherUserUsersFollowing?.length
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
      commentToDelete.reactingUserId === currentUser.id
        ? setCurrentUserPostOrComment(true)
        : setCurrentUserPostOrComment(false);
    }
  };

  const handleHidePostOptionsModal = () => setPostOptionsModalShow(false);

  const handleArchivePost = () =>
    archivePostStart({
      postId: postModalProps.id,
      s3Key: postModalProps.s3Key,
    });

  const handleHideFollowersOrFollowingModal = () => {
    setFollowersOrFollowingModalShow(false);
    clearFollowersAndFollowing();
    clearFollowPhotoFileArray();
  };

  const handleHideLikesModal = () => setShowPostLikingUsersModal(false);

  const handleHideCommentOptionsModal = () => setShowCommentOptionsModal(false);

  const handleArchiveCommentOptionsModal = () => {
    if (commentToDelete) {
      deleteReactionStart(commentToDelete);
      setShowCommentOptionsModal(false);
    }
  };

  const handleHideUnfollowModal = () => setUnfollowModalShow(false);

  const handleUnfollow = () => {
    unfollowUserStart(otherUser!.id);
    setUnfollowModalShow(false);
  };

  const handleGoToPostClick = () => {
    navigate(`/p/${postModalProps.id}`);
  };

  if (otherUserError) {
    return <NotFoundPage />;
  }

  return (
    <div className='profile-page' data-testid='user-profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
          <div className='avatar'>
            {profilePhotoString ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${profilePhotoString}`}
                alt='profile-pic'
              />
            ) : null}
            {!profilePhotoString ? (
              <div className='user-bio-photo-placeholder'>
                <span className='user-bio-photo-placeholder-text'>
                  No photo
                </span>
              </div>
            ) : null}
          </div>
          <div className='user-details'>
            <div className='username-and-follow'>
              <span className='user-username'>{otherUser?.username}</span>
              {handleRenderFollowOrFollowingButton(false)}
            </div>
            {handleRenderFollowOrFollowingButton(true)}
            <div className='posts-followers-following-stats'>
              {getPostDataConfirm ? (
                <span className='user-stat'>
                  {postMetaDataForUser?.queryLength || 0} Posts
                </span>
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              )}
              <span
                className={handleMakeStatClickable('followers', 'user-stat')}
                onClick={handleRenderFollowersModal}
              >
                {followers?.length ? followers.length : 0} Followers
              </span>
              <span
                className={handleMakeStatClickable('following', 'user-stat')}
                onClick={handleRenderFollowingModal}
              >
                {otherUserUsersFollowing?.length
                  ? otherUserUsersFollowing.length
                  : 0}{' '}
                Following
              </span>
            </div>
            <div className='name-and-bio'>
              <span className='user-name'>{otherUser?.name}</span>
              <span className='user-bio'>{otherUser?.bio}</span>
            </div>
          </div>
        </div>
        <div className='name-and-bio-narrow-screen'>
          <span className='user-name-narrow'>{otherUser?.name}</span>
          <span className='user-bio-narrow'>{otherUser?.bio}</span>
        </div>
        <div className='posts-followers-following-stats-narrow-screen'>
          <ul className='stats-list'>
            {getPostDataConfirm ? (
              <li className='stats-item'>
                {postMetaDataForUser?.queryLength || 0} Posts
              </li>
            ) : (
              <Box
                sx={{ display: 'flex' }}
                className='posts-followers-following-stats-narrow-screen'
              >
                <CircularProgress />
              </Box>
            )}
            <li
              className={handleMakeStatClickable('followers', 'stats-item')}
              onClick={handleRenderFollowersModal}
            >
              {followers?.length ? followers.length : 0} Followers
            </li>
            <li
              className={handleMakeStatClickable('following', 'stats-item')}
              onClick={handleRenderFollowingModal}
            >
              {otherUserUsersFollowing?.length
                ? otherUserUsersFollowing.length
                : 0}{' '}
              Following
            </li>
          </ul>
        </div>
      </div>
      <div className='posts-grid'>
        {postFileArray?.length
          ? postFileArray.map((file, idx) => (
              <PostTile
                fileString={file.fileString}
                key={idx}
                id={file.s3Key}
                dataS3Key={file.s3Key}
                onClick={handleRenderPostModal}
                custRef={
                  idx === postFileArray?.length - 1 ? observedElementRef : null
                }
                postLikesCount={postData?.[idx]?.likes || 0}
                postCommentsCount={postData?.[idx]?.comments || 0}
              />
            ))
          : null}
        {isLoadingPostData ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : null}
      </div>
      <PostModal
        postId={postModalProps.id}
        show={postModalShow}
        fileString={postModalProps.fileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={postModalProps.createdAt || ''}
        onHide={handleHidePostModal}
        onOptionsClick={handlePostOptionsClick}
        onPostLikingUsersClick={handlePostLikingUsersClick}
        userProfilePhotoFile={profilePhotoString}
        userName={otherUser?.username || ''}
        userId={otherUser?.id || ''}
        clearLocalState={clearPostModalLocalState}
        isVideo={postModalProps.isVideo}
        s3Key={postModalProps.s3Key}
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={handleHidePostOptionsModal}
        isCurrentUserPostOrComment={false}
        postOptionsModal={true}
        onGoToPostClick={handleGoToPostClick}
        archive={handleArchivePost}
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={handleHideCommentOptionsModal}
        archive={handleArchiveCommentOptionsModal}
        isCurrentUserPostOrComment={currentUserPostOrComment}
        postOptionsModal={false}
      />
      <UnfollowModal
        show={unfollowModalShow}
        onHide={handleHideUnfollowModal}
        unfollow={handleUnfollow}
        username={username}
        profilePhoto={profilePhotoString}
      />
      <FollowersOrFollowingOrLikesModal
        currentOrOtherUser='other'
        show={followersOrFollowingModalShow}
        onHide={handleHideFollowersOrFollowingModal}
      />
      {postLikingUsersArray?.length ? (
        <FollowersOrFollowingOrLikesModal
          currentOrOtherUser='other'
          show={showPostLikingUsersModal}
          onHide={handleHideLikesModal}
          isPostLikingUsersModal={true}
          postLikingUsersArray={postLikingUsersArray}
        />
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (otherUserRequest: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserRequest)),
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  clearFollowPhotoFileArray: () => dispatch(clearFollowPhotoFileArray()),
  followNewUserStart: (userToFollowId: string) =>
    dispatch(followNewUserStart(userToFollowId)),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  unfollowUserStart: (userId: string) => dispatch(unfollowUserStart(userId)),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearPostFilesAndData: () => dispatch(clearPostFilesAndData()),
  clearFollowState: () => dispatch(clearFollowState()),
  setIsCurrentUserProfilePage: (isCurrentUserProfilePage: boolean) =>
    dispatch(setIsCurrentUserProfilePage(isCurrentUserProfilePage)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  clearPostState: () => dispatch(clearPostState()),
});

export default connect(null, mapDispatchToProps)(UserProfilePage);
