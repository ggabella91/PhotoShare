import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../../hooks';
import MapBoxMap from '../../components/mapbox-map/mapbox-map.component';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  Post,
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
  const [postDataList, setPostDataList] = useState<List<Post>>(List());

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState<PostModalMapProps>(
    Map({
      id: '',
      s3Key: '',
      caption: '',
      location: '',
      createdAt: null,
      fileString: '',
      isVideo: false,
    })
  );

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
    if (postData && postData.length) {
      let postDataList = List(postData);

      setPostDataList(postDataList);

      if (!locationCoordinates) {
        if (postData.length && postData[0].postLocation) {
          const { latitude, longitude } = postData[0].postLocation;
          dispatch(setLocationCoordinates({ latitude, longitude }));
        }
      }
    }
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
  }, [intersectionCounter]);

  useEffect(() => {
    if (postData && postDataList.size === postData.length) {
      postDataList.forEach((post) => {
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
  }, [dispatch, postDataList]);

  let postFileList = useMemo(() => {
    if (postData && postFiles.length === postData.length) {
      let orderedFiles: List<PostFile> = List();

      postDataList.forEach((post) => {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles = orderedFiles.push(fileMatch);
        }
      });

      return orderedFiles;
    }
  }, [postFiles]);

  useEffect(() => {
    if (archivePostConfirm) {
      dispatch(clearArchivePostStatuses());
      setPostOptionsModalShow(false);
      setPostModalShow(false);
      setClearPostModalLocalState(true);

      const newDataArray = postDataList.filter(
        (el) => el.id !== postModalProps.get('id')
      );
      setPostDataList(newDataArray);

      const newFileArray = postFileList?.filter(
        (el) => el.s3Key !== postModalProps.get('s3Key')
      );
      postFileList = newFileArray;
    }
  }, [archivePostConfirm]);

  const handleRenderPostModal = (event: React.MouseEvent<HTMLDivElement>) => {
    const overlayDivElement = event.target as HTMLElement;
    const postS3Key = overlayDivElement.dataset.s3key;

    const postData = postDataList.find((el) => el.s3Key === postS3Key);
    const postFileString = postFileList?.find(
      (el) => el.s3Key === postS3Key
    )?.fileString;

    if (postData) {
      dispatch(
        getOtherUserStart({
          usernameOrId: postData.userId,
          type: OtherUserType.EXPLORE_POST_MODAL,
        })
      );
    }

    if (postData && postFileString) {
      const caption = postData.caption || '';
      const location = postData.postLocation || '';
      const { createdAt } = postData;

      setPostModalProps(
        Map({
          id: postData.id,
          caption,
          s3Key: postS3Key,
          location,
          createdAt,
          fileString: postFileString,
          isVideo: postData.isVideo,
        })
      );
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
    setPostModalProps(
      Map({
        id: '',
        s3Key: '',
        caption: '',
        location: '',
        createdAt: null,
        fileString: '',
        isVideo: false,
      })
    );
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
        postId: postModalProps.get('id'),
        s3Key: postModalProps.get('s3Key'),
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
    navigate(`/p/${postModalProps.get('id')}`);
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
            {postDataList.get(0)?.postLocation?.label || location}
          </span>
        </div>
      </div>
      <div className='subhead-and-posts-grid'>
        <div className='subhead'>
          <span className='top-posts'>Top posts</span>
        </div>
        <div className='posts-grid'>
          {postFileList && postFileList.size
            ? postFileList.map((file, idx) => (
                <PostTile
                  fileString={file.fileString}
                  id={file.s3Key}
                  key={idx}
                  dataS3Key={file.s3Key}
                  onClick={handleRenderPostModal}
                  custRef={
                    idx === postFileList!.size - 1 ? observedElementRef : null
                  }
                  postLikesCount={postDataList.get(idx)?.likes || 0}
                  postCommentsCount={postDataList.get(idx)?.comments || 0}
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
        postId={postModalProps.get('id')}
        show={postModalShow}
        fileString={postModalProps.get('fileString')}
        caption={postModalProps.get('caption')}
        location={postModalProps.get('location')}
        createdAt={postModalProps.get('createdAt') || ''}
        onHide={handleHidePostModal}
        onOptionsClick={handlePostOptionsClick}
        onPostLikingUsersClick={handlePostLikingUsersClick}
        userProfilePhotoFile={otherUserProfilePhotoFile?.fileString || ''}
        userName={otherUser?.username || ''}
        userId={otherUser?.id || ''}
        clearLocalState={clearPostModalLocalState}
        isVideo={postModalProps.get('isVideo')}
        s3Key={postModalProps.get('s3Key')}
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
          users={null}
          show={showPostLikingUsersModal}
          onHide={handleHideLikesModal}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersArray={postLikingUsersArray}
        />
      ) : null}
    </div>
  );
};

export default ExploreLocationPage;
