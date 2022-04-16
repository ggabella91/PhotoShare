import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../hooks';

import { OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  Post,
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
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { AppState } from '../../redux/root-reducer';

import './explore-tag-page.styles.scss';

const ExploreTagPage: React.FC = () => {
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

  const [postLikersList, setPostLikersList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [pageToFetch, setPageToFetch] = useState(1);

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

  const { intersectionCounter, lastElementRef } =
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
    hashtag &&
      dispatch(getPostsWithHashtagStart({ hashtag, pageToShow: 1, limit: 9 }));

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
    if (postData && postData.length) {
      let postDataList = List(postData);

      setPostDataList(postDataList);
    }
  }, [postData]);

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
  }, [postDataList]);

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
  }, [otherUser]);

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
  }, [showCommentOptionsModal]);

  const handleSetIsCurrentUserComment = () => {
    if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
      commentToDelete.reactingUserId === currentUser.id
        ? setCurrentUserPostOrComment(true)
        : setCurrentUserPostOrComment(false);
    }
  };

  useEffect(() => {
    if (postLikingUsersArray) {
      setPostLikersList(List(postLikingUsersArray));
    }
  }, [postLikingUsersArray]);

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
    <div className='explore-tag-page' data-testid='explore-tag-page'>
      <div className='photo-and-hashtag-details'>
        <div className='photo'>
          {postFileList?.size ? (
            <img
              className='hashtag-photo'
              src={`data:image/jpeg;base64,${postFileList.get(0)?.fileString}`}
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
          {postFileList && postFileList.size
            ? postFileList.map((file, idx) => (
                <PostTile
                  fileString={file.fileString}
                  key={idx}
                  dataS3Key={file.s3Key}
                  onClick={handleRenderPostModal}
                  custRef={
                    idx === postFileList!.size - 1 ? lastElementRef : null
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
      {postLikersList.size ? (
        <FollowersOrFollowingOrLikesModal
          users={null}
          show={showPostLikingUsersModal}
          onHide={handleHideLikesModal}
          isFollowersModal={false}
          isPostLikingUsersModal={true}
          postLikingUsersList={postLikersList}
        />
      ) : null}
    </div>
  );
};

export default ExploreTagPage;
