import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../../hooks';

import { OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  FileRequestType,
  PostFile,
  UserType,
} from '../../redux/post/post.types';
import {
  getPostsWithHashtagStart,
  getPostFileStart,
  clearPostState,
  setShowPostEditForm,
  archivePostStart,
  deleteReactionStart,
  setShowCommentOptionsModal,
  clearArchivePostStatuses,
} from '../../redux/post/post.actions';

import PostModal from '../../components/post-modal/post-modal.component';
import PostTile from '../../components/post-tile/post-tile.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

import { PostModalMapProps } from '../my-profile/my-profile-page.component';
import { AppState } from '../../redux/root-reducer';

import './explore-tag-page.styles.scss';

const ExploreTagPage: React.FC = () => {
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

  const dispatch = useDispatch();

  const postState = useSelector((state: AppState) => state.post);
  const userState = useSelector((state: AppState) => state.user);

  const { currentUser, otherUser } = userState;
  const {
    postData,
    getPostDataConfirm,
    postFiles,
    postMetaDataForHashtag,
    isLoadingPostData,
    postLikingUsersArray,
    commentToDelete,
    showCommentOptionsModal,
    otherUserProfilePhotoFile,
    archivePostConfirm,
  } = postState;

  const { intersectionCounter, observedElementRef } =
    useLazyLoading(isLoadingPostData);

  let navigate = useNavigate();
  const { hashtag } = useParams();

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (hashtag && !fetchedFirstPage.current) {
      fetchedFirstPage.current = true;
      dispatch(getPostsWithHashtagStart({ hashtag, pageToShow: 1, limit: 9 }));
    }

    setPostModalShow(false);
    setPostOptionsModalShow(false);
    setShowPostLikingUsersModal(false);

    // Clear post state and follow state when cleaning
    // up before component leaves the screen
    return () => {
      dispatch(clearPostState());
    };
  }, [hashtag]);

  useEffect(() => {
    if (
      postMetaDataForHashtag &&
      intersectionCounter > 1 &&
      pageToFetch + 1 <= Math.ceil(postMetaDataForHashtag.queryLength / 9) &&
      currentUser &&
      postData &&
      postData.length === postFiles.length
    ) {
      hashtag &&
        getPostsWithHashtagStart({
          hashtag,
          pageToShow: pageToFetch + 1,
          limit: 9,
        });

      setPageToFetch(pageToFetch + 1);
    }
  }, [intersectionCounter]);

  useEffect(() => {
    postData?.forEach((post) => {
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
  }, [postData]);

  let postFileList = useMemo(() => {
    if (postData && postFiles.length === postData.length) {
      let orderedFiles: PostFile[] = [];

      postData.forEach((post) => {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles.push(fileMatch);
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
    }
  }, [archivePostConfirm]);

  const handleRenderPostModal = (event: React.MouseEvent<HTMLDivElement>) => {
    const overlayDivElement = event.target as HTMLElement;
    const postS3Key = overlayDivElement.dataset.s3key || '';

    const data = postData?.find((el) => el.s3Key === postS3Key);
    const postFileString = postFileList?.find(
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
  }, [otherUser]);

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
    <div className='explore-tag-page' data-testid='explore-tag-page'>
      <div className='photo-and-hashtag-details'>
        <div className='photo'>
          {postFileList?.length ? (
            <img
              className='hashtag-photo'
              src={`data:image/jpeg;base64,${postFileList?.[0]?.fileString}`}
              alt='hashtag-pic'
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                marginTop: 'calc(1vh + 15px)',
                marginRight: '2vw',
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </div>
        <div className='hashtag-details'>
          <span className='hashtag-name'>#{hashtag}</span>
          {getPostDataConfirm ? (
            <span className='hashtag-stat'>
              {postMetaDataForHashtag?.queryLength || 0} Posts
            </span>
          ) : (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          )}
        </div>
      </div>
      <div className='subhead-and-posts-grid'>
        <div className='subhead'>
          <span className='top-posts'>Top posts</span>
        </div>
        <div className='posts-grid'>
          {postFileList && postFileList.length
            ? postFileList.map((file, idx) => (
                <PostTile
                  fileString={file.fileString}
                  id={file.s3Key}
                  key={idx}
                  dataS3Key={file.s3Key}
                  onClick={handleRenderPostModal}
                  custRef={
                    idx === postFileList!.length - 1 ? observedElementRef : null
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

export default ExploreTagPage;
