import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../../hooks';
import MapBoxMap from '../../components/mapbox-map/mapbox-map.component';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  FileRequestType,
  PostFile,
  UserType,
} from '../../redux/post/post.types';
import {
  getPostsWithLocationStart,
  getPostFileStart,
  clearPostState,
  setShowPostEditForm,
  archivePostStart,
  deleteReactionStart,
  setShowCommentOptionsModal,
  clearArchivePostStatuses,
  setLocationCoordinates,
} from '../../redux/post/post.actions';

import PostModal from '../../components/post-modal/post-modal.component';
import PostTile from '../../components/post-tile/post-tile.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

import { PostModalMapProps } from '../my-profile/my-profile-page.component';
import { AppState } from '../../redux/root-reducer';

import './explore-location-page.styles.scss';

const ExploreLocationPage: React.FC = () => {
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

  const [currentUserPostOrComment, setCurrentUserPostOrComment] =
    useState<boolean>(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [pageToFetch, setPageToFetch] = useState(1);
  const fetchedFirstPage = useRef(false);

  const { locationId, location } = useParams();

  const dispatch = useDispatch();

  const postState = useSelector((state: AppState) => state.post);
  const userState = useSelector((state: AppState) => state.user);

  const { currentUser, otherUser } = userState;
  const {
    postData,
    postFiles,
    postMetaDataForLocation,
    isLoadingPostData,
    postLikingUsersArray,
    commentToDelete,
    showCommentOptionsModal,
    otherUserProfilePhotoFile,
    archivePostConfirm,
    locationCoordinates,
  } = postState;

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
    if (locationId && !fetchedFirstPage.current) {
      fetchedFirstPage.current = true;
      dispatch(
        getPostsWithLocationStart({ locationId, pageToShow: 1, limit: 9 })
      );
    }
    setPostModalShow(false);
    setPostOptionsModalShow(false);
    setShowPostLikingUsersModal(false);

    // Clear post state and follow state when cleaning
    // up before component leaves the screen
    return () => {
      dispatch(clearPostState());
    };
  }, [dispatch, locationId]);

  useEffect(() => {
    if (postData?.length && !locationCoordinates) {
      if (postData[0].postLocation) {
        const { latitude, longitude } = postData[0].postLocation;
        dispatch(setLocationCoordinates({ latitude, longitude }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postData]);

  useEffect(() => {
    if (
      postMetaDataForLocation &&
      intersectionCounter > 1 &&
      pageToFetch + 1 <= Math.ceil(postMetaDataForLocation.queryLength / 9) &&
      currentUser &&
      postData &&
      postData.length === postFiles.length
    ) {
      locationId &&
        getPostsWithLocationStart({
          locationId,
          pageToShow: pageToFetch + 1,
          limit: 9,
        });

      setPageToFetch(pageToFetch + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersectionCounter]);

  useEffect(() => {
    if (postData) {
      postData.forEach((post) => {
        dispatch(
          getPostFileStart({
            s3Key: post.s3Key,
            isVideo: post.isVideo,
            videoThumbnailS3Key: post.videoThumbnailS3Key,
            bucket: postsBucket,
            user: UserType.self, // not relevant here but part of the request body
            fileRequestType: FileRequestType.singlePost,
          })
        );
      });
    }
  }, [dispatch, postData, postsBucket]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postFiles]);

  useEffect(() => {
    if (archivePostConfirm) {
      dispatch(clearArchivePostStatuses());
      setPostOptionsModalShow(false);
      setPostModalShow(false);
      setClearPostModalLocalState(true);
    }
  }, [dispatch, archivePostConfirm]);

  const handleRenderPostModal = (event: React.MouseEvent<HTMLDivElement>) => {
    const overlayDivElement = event.target as HTMLElement;
    const postS3Key = overlayDivElement.dataset.s3key || '';

    const data = postData?.find((el) => el.s3Key === postS3Key);
    const postFileString = postFileArray?.find(
      (el) => el.s3Key === postS3Key
    )?.fileString;

    if (data) {
      dispatch(
        getOtherUserStart({
          usernameOrId: data.userId,
          type: OtherUserType.EXPLORE_POST_MODAL,
        })
      );
    }

    if (data && postFileString) {
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

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      dispatch(
        getPostFileStart({
          s3Key: otherUser.photo,
          user: UserType.other,
          bucket: profileBucket,
          fileRequestType: FileRequestType.singlePost,
        })
      );
    }
  }, [dispatch, otherUser, profileBucket]);

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
    dispatch(setShowPostEditForm(false));
  };

  const handlePostOptionsClick = () => setPostOptionsModalShow(true);

  const handlePostLikingUsersClick = () => setShowPostLikingUsersModal(true);

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
    dispatch(
      archivePostStart({
        postId: postModalProps.id,
        s3Key: postModalProps.s3Key,
      })
    );

  const handleHideLikesModal = () => setShowPostLikingUsersModal(false);

  const handleHideCommentOptionsModal = () =>
    dispatch(setShowCommentOptionsModal(false));

  const handleArchiveCommentOptionsModal = () => {
    if (commentToDelete) {
      dispatch(deleteReactionStart(commentToDelete));
      dispatch(setShowCommentOptionsModal(false));
    }
  };

  const handleGoToPostClick = () => {
    navigate(`/p/${postModalProps.id}`);
  };

  return (
    <div className='explore-location-page' data-testid='explore-location-page'>
      <MapBoxMap />
      <div className='avatar-and-location'>
        <div className='location-avatar-container'>
          <div className='location-avatar'>
            <LocationOnIcon fontSize='large' />
          </div>
        </div>
        <div className='location-label-container'>
          <span className='location-label'>
            {postData?.[0]?.postLocation?.label || location}
          </span>
        </div>
      </div>
      <div className='subhead-and-posts-grid'>
        <div className='subhead'>
          <span className='top-posts'>Top posts</span>
        </div>
        <div className='posts-grid'>
          {postFileArray && postFileArray.length
            ? postFileArray.map((file, idx) => (
                <PostTile
                  fileString={file.fileString}
                  id={file.s3Key}
                  key={idx}
                  dataS3Key={file.s3Key}
                  onClick={handleRenderPostModal}
                  custRef={
                    idx === postFileArray!.length - 1
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
        userProfilePhotoFile={otherUserProfilePhotoFile?.fileString || ''}
        userName={otherUser?.username || ''}
        userId={otherUser?.id || ''}
        clearLocalState={clearPostModalLocalState}
        isVideo={postModalProps.isVideo}
        s3Key={postModalProps.s3Key}
        isCurrentUserPost
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

export default ExploreLocationPage;
