import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';

import { AppState } from '../../redux/root-reducer';

import { useLazyLoading } from '../../hooks';

import {
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
} from '../../redux/user/user.actions';

import {
  Post,
  DataRequestType,
  FileRequestType,
  PostDataReq,
  PostFileReq,
  ArchivePostReq,
  PostFile,
  PostError,
  UserType,
  DeleteReactionReq,
  Location,
} from '../../redux/post/post.types';
import {
  selectShowCommentOptionsModal,
  selectPostLikingUsersArray,
  selectGetSinglePostDataConfirm,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearArchivePostStatuses,
  clearFollowPhotoFileArray,
  clearPostState,
  setShowCommentOptionsModal,
  deleteReactionStart,
  setShowPostEditForm,
  clearPostMetaDataForUser,
} from '../../redux/post/post.actions';

import {
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  getFollowersStart,
  getUsersFollowingStart,
  clearFollowState,
  setIsFollowersModal,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

import './profile-page.styles.scss';

export interface UserLite {
  id: string;
  name: string;
  username: string;
  bio: string;
}

interface MyProfilePageProps {
  archivePostError: PostError | null;
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  getSinglePostDataConfirm: Post | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
  clearArchivePostStatuses: typeof clearArchivePostStatuses;
  clearPostState: typeof clearPostState;
  clearFollowPhotoFileArray: typeof clearFollowPhotoFileArray;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
  setIsCurrentUserProfilePage: typeof setIsCurrentUserProfilePage;
  setShowCommentOptionsModal: typeof setShowCommentOptionsModal;
  deleteReactionStart: typeof deleteReactionStart;
  setShowPostEditForm: typeof setShowPostEditForm;
}

export interface PostModalMapProps {
  id: string;
  s3Key: string;
  caption: string;
  location: Location | null;
  createdAt: Date | null;
  fileString: string;
  isVideo?: boolean;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearArchivePostStatuses,
  clearFollowPhotoFileArray,
  clearPostState,
  getFollowersStart,
  getUsersFollowingStart,
  clearFollowersAndFollowing,
  clearFollowState,
  setIsCurrentUserProfilePage,
  showCommentOptionsModal,
  setShowCommentOptionsModal,
  deleteReactionStart,
  postLikingUsersArray,
  getSinglePostDataConfirm,
  setShowPostEditForm,
}) => {
  const [profilePhotoString, setProfilePhotoString] = useState<string>('');

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

  const [followersOrFollowingModalShow, setFollowersOrFollowingModalShow] =
    useState(false);

  const [currentUserPostOrComment, setCurrentUserPostOrComment] =
    useState<boolean>(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const pageToFetch = useRef(1);

  const postState = useSelector((state: AppState) => state.post);
  const userState = useSelector((state: AppState) => state.user);
  const followerState = useSelector((state: AppState) => state.follower);

  const {
    postMetaDataForUser,
    isLoadingPostData,
    postData,
    postFiles,
    profilePhotoKey,
    profilePhotoFile,
    getPostDataConfirm,
    archivePostConfirm,
    commentToDelete,
  } = postState;
  const { currentUser } = userState;
  const { followers, currentUserUsersFollowing } = followerState;
  const dispatch = useDispatch();

  const { intersectionCounter, observedElementRef } =
    useLazyLoading(isLoadingPostData);

  let navigate = useNavigate();

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
    setIsCurrentUserProfilePage(true);

    // Clear post state and follow state when cleaning
    // up before component leaves the screen
    return () => {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();
      dispatch(clearPostMetaDataForUser());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (pageToFetch.current === 1) {
      getPostDataStart({
        userId: currentUser.id,
        dataReqType: DataRequestType.single,
        pageToShow: pageToFetch.current++,
        limit: 9,
      });
      getFollowersStart(currentUser.id);
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket: profileBucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!profilePhotoFile && currentUser?.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket: profileBucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilePhotoKey]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setProfilePhotoString(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (
      postMetaDataForUser &&
      intersectionCounter > 1 &&
      pageToFetch.current + 1 <=
        Math.ceil(postMetaDataForUser.queryLength / 9) &&
      currentUser &&
      postData &&
      postData.length === postFiles.length
    ) {
      getPostDataStart({
        userId: currentUser.id,
        dataReqType: DataRequestType.single,
        pageToShow: pageToFetch.current++,
        limit: 9,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectionCounter]);

  useEffect(() => {
    if (!getSinglePostDataConfirm) {
      postData?.forEach((post) => {
        getPostFileStart({
          s3Key: post.s3Key,
          isVideo: post.isVideo,
          videoThumbnailS3Key: post.videoThumbnailS3Key,
          bucket: postsBucket,
          user: UserType.self,
          fileRequestType: FileRequestType.singlePost,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData]);

  let postFileArray = useMemo(() => {
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

  useEffect(() => {
    if (archivePostConfirm) {
      clearArchivePostStatuses();
      setPostOptionsModalShow(false);
      setPostModalShow(false);
      setClearPostModalLocalState(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archivePostConfirm]);

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
      setPostModalShow(true);
      setClearPostModalLocalState(false);
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
    setShowPostEditForm(false);
  };

  const handlePostOptionsClick = () => setPostOptionsModalShow(true);

  const handlePostLikingUsersClick = () => setShowPostLikingUsersModal(true);

  const handleRenderFollowersModal = () => {
    if (followers?.length) {
      dispatch(setIsFollowersModal(true));
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleRenderFollowingModal = () => {
    if (currentUserUsersFollowing?.length) {
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
      return currentUserUsersFollowing?.length
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    }
  };

  useEffect(() => {
    handleSetIsCurrentUserComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete?.reactingUserId) {
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

  const handleGoToPostClick = () => {
    navigate(`/p/${postModalProps.id}`);
  };

  return (
    <div className='profile-page' data-testid='my-profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
          <div className='avatar'>
            {profilePhotoString.length ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${profilePhotoString}`}
                alt='profile-pic'
              />
            ) : null}
            {!profilePhotoString.length ? (
              <div className='user-bio-photo-placeholder'>
                <span className='user-bio-photo-placeholder-text'>
                  No photo
                </span>
              </div>
            ) : null}
          </div>
          <div className='user-details'>
            <div className='username-and-edit'>
              <span className='user-username'>{currentUser?.username}</span>
              <NavLink className='edit-profile' to='/settings'>
                <span className='edit-text'>Edit profile</span>
              </NavLink>
            </div>
            <NavLink to='/settings' className='edit-profile-narrow-screen'>
              <span className='edit-narrow-text'>Edit profile</span>
            </NavLink>
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
                {currentUserUsersFollowing?.length
                  ? currentUserUsersFollowing.length
                  : 0}{' '}
                Following
              </span>
            </div>
            <div className='name-and-bio'>
              <span className='user-name'>{currentUser?.name}</span>
              <span className='user-bio'>{currentUser?.bio}</span>
            </div>
          </div>
        </div>
        <div className='name-and-bio-narrow-screen'>
          <span className='user-name-narrow'>{currentUser?.name}</span>
          <span className='user-bio-narrow'>{currentUser?.bio}</span>
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
              {currentUserUsersFollowing?.length
                ? currentUserUsersFollowing.length
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
                  idx === (postFileArray?.length || 0) - 1
                    ? observedElementRef
                    : null
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
        userName={currentUser?.username || ''}
        userId={currentUser?.id || ''}
        clearLocalState={clearPostModalLocalState}
        isCurrentUserPost
        isVideo={postModalProps.isVideo}
        s3Key={postModalProps.s3Key}
      />
      <PostOrCommentOptionsModal
        show={postOptionsModalShow}
        onHide={handleHidePostOptionsModal}
        isCurrentUserPostOrComment={true}
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
      <FollowersOrFollowingOrLikesModal
        currentOrOtherUser='current'
        show={followersOrFollowingModalShow}
        onHide={handleHideFollowersOrFollowingModal}
      />
      {postLikingUsersArray?.length ? (
        <FollowersOrFollowingOrLikesModal
          currentOrOtherUser='current'
          show={showPostLikingUsersModal}
          onHide={handleHideLikesModal}
          isPostLikingUsersModal={true}
          postLikingUsersArray={postLikingUsersArray}
        />
      ) : null}
    </div>
  );
};

interface LinkStateProps {
  showCommentOptionsModal: boolean;
  postLikingUsersArray: UserInfoAndOtherData[] | null;
  getSinglePostDataConfirm: Post | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  showCommentOptionsModal: selectShowCommentOptionsModal,
  postLikingUsersArray: selectPostLikingUsersArray,
  getSinglePostDataConfirm: selectGetSinglePostDataConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: (postDataReq: PostDataReq) =>
    dispatch(getPostDataStart(postDataReq)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  archivePostStart: (archiveReq: ArchivePostReq) =>
    dispatch(archivePostStart(archiveReq)),
  clearArchivePostStatuses: () => dispatch(clearArchivePostStatuses()),
  clearPostState: () => dispatch(clearPostState()),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  clearFollowPhotoFileArray: () => dispatch(clearFollowPhotoFileArray()),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearFollowState: () => dispatch(clearFollowState()),
  setIsCurrentUserProfilePage: (isCurrentUserProfilePage: boolean) =>
    dispatch(setIsCurrentUserProfilePage(isCurrentUserProfilePage)),
  setShowCommentOptionsModal: (showCommentOptionsModal: boolean) =>
    dispatch(setShowCommentOptionsModal(showCommentOptionsModal)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  setShowPostEditForm: (showPostEditForm: boolean) =>
    dispatch(setShowPostEditForm(showPostEditForm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
