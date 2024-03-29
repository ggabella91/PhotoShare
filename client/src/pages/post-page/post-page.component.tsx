import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import slugify from 'slugify';

import { AppState } from '../../redux/root-reducer';

import { postNotificationStart } from '../../redux/follower/follower.actions';

import { User, OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Reaction,
  Post,
  FileRequestType,
  ReactionRequestType,
  UserType,
  Location,
} from '../../redux/post/post.types';
import {
  getSinglePostDataStart,
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  getUserPhotoForReactorArraySuccess,
  archivePostStart,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostEditForm,
  clearPostState,
  setShowCommentOptionsModal,
  setIsPostPage,
  setLocationCoordinates,
  clearPostFilesAndData,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../../components/user-info/user-info.component';

import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import Button from '../../components/button/button.component';
import { ExpandableFormInput } from '../../components/form-input/form-input.component';
import EditPostForm from '../../components/edit-post-form/edit-post-form.component';

import {
  compareUserInfoAndDataObjArrays,
  compareUserOrPostOrReactionArrays,
} from '../../pages/feed-page/feed-page.utils';

import './post-page.styles.scss';

export interface AlreadyLikedAndReactionId {
  alreadyLikedPost: boolean;
  reactionId: string;
}

export const PostPage: React.FC = () => {
  const userState = useSelector((state: AppState) => state.user);
  const postState = useSelector((state: AppState) => state.post);

  const dispatch = useDispatch();

  const { postId } = useParams();

  const { currentUser, otherUser, postReactingUsers } = userState;

  const {
    getSinglePostDataConfirm,
    postFiles,
    otherUserProfilePhotoFile,
    postReactionsArray,
    postReactionConfirm,
    deleteReactionConfirm,
    reactorPhotoFileArray,
    showPostEditForm,
    commentToDelete,
    showCommentOptionsModal,
    editPostDetailsConfirm,
    isLoadingPostData,
  } = postState;

  const [postData, setPostData] = useState<Post | null>(null);

  const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);

  const [isCurrentUserComment, setIsCurrentUserComment] = useState(false);

  const [comment, setComment] = useState('');

  const [captionInfoArray, setCaptionInfoArray] = useState<
    UserInfoAndOtherData[]
  >([]);

  const [reactionsArray, setReactionsArray] = useState<Reaction[]>([]);

  const [uniqueReactingUsers, setUniqueReactingUsers] = useState<Set<string>>(
    new Set()
  );

  const [reactingUserInfoArray, setReactingUsersInfoArray] = useState<User[]>(
    []
  );

  const [commentingUserArray, setCommentingUserArray] = useState<
    UserInfoAndOtherData[]
  >([]);

  const [likingUsersArray, setLikingUsersArray] = useState<
    UserInfoAndOtherData[]
  >([]);

  const [alreadyLikedPostAndReactionId, setAlreadyLikedPostAndReactionId] =
    useState<AlreadyLikedAndReactionId>({
      alreadyLikedPost: false,
      reactionId: '',
    });

  const [editPostDetails, setEditPostDetails] = useState({
    editCaption: '',
    editLocation: '',
  });

  const [areReactionsReadyForRendering, setAreReactionsReadyForRendering] =
    useState(false);

  const [showPostOptionsModal, setShowPostOptionsModal] = useState(false);

  const [showPostLikingUsersModal, setShowPostLikingUsersModal] =
    useState(false);

  const [slugifiedLocationLabel, setSlugifiedLocationLabel] = useState('');

  const [playVideo, setPlayVideo] = useState(false);

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
    () => {
      dispatch(setIsPostPage(true));

      return () => {
        dispatch(clearPostState());
        dispatch(setIsPostPage(false));
      };
    },
    [dispatch]
  );

  useEffect(() => {
    if (postId) {
      setPlayVideo(false);
      setAreReactionsReadyForRendering(false);
      dispatch(clearPostFilesAndData());
      dispatch(getSinglePostDataStart({ postId }));
    }
  }, [dispatch, postId]);

  useEffect(() => {
    if (getSinglePostDataConfirm) {
      setPostData(getSinglePostDataConfirm);
      setEditPostDetails({
        editCaption: getSinglePostDataConfirm.caption || '',
        editLocation: getSinglePostDataConfirm.postLocation?.label || '',
      });

      if (getSinglePostDataConfirm.postLocation) {
        dispatch(
          setLocationCoordinates({
            latitude: getSinglePostDataConfirm.postLocation.latitude,
            longitude: getSinglePostDataConfirm.postLocation.longitude,
          })
        );
      }

      const { userId } = getSinglePostDataConfirm;

      dispatch(
        getOtherUserStart({
          type: OtherUserType.POST_PAGE_USER,
          usernameOrId: userId,
        })
      );
    }
  }, [dispatch, getSinglePostDataConfirm]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      dispatch(
        getPostFileStart({
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
          s3Key: otherUser.photo,
          bucket: profileBucket,
        })
      );
    }
  }, [dispatch, otherUser, profileBucket]);

  useEffect(() => {
    if (postData) {
      handleSetIsCurrentUserPost(postData);

      if (postData.postLocation && postData.postLocation.label) {
        const slugifiedString = slugify(postData.postLocation.label, {
          lower: true,
          strict: true,
        });
        setSlugifiedLocationLabel(slugifiedString);
      }

      dispatch(
        getPostFileStart({
          s3Key: postData.s3Key,
          isVideo: postData.isVideo,
          videoThumbnailS3Key: postData.videoThumbnailS3Key,
          bucket: postsBucket,
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, postData]);

  useEffect(() => {
    if (postData && otherUser && otherUserProfilePhotoFile) {
      setCaptionInfoArray([
        {
          username: otherUser.username,
          name: '',
          profilePhotoFileString: otherUserProfilePhotoFile.fileString,
          comment: postData.caption || '',
          location: {} as Location,
          commentDate: postData.createdAt,
        },
      ]);
    }
  }, [postData, otherUser, otherUserProfilePhotoFile]);

  useEffect(() => {
    if (editPostDetailsConfirm) {
      let newCaption = editPostDetailsConfirm.caption || '';
      let newLocation = editPostDetailsConfirm.postLocation || ({} as Location);

      if (postData && otherUser && otherUserProfilePhotoFile && newCaption) {
        setCaptionInfoArray([
          {
            username: otherUser.username,
            name: '',
            profilePhotoFileString: otherUserProfilePhotoFile.fileString,
            comment: newCaption,
            location: newLocation,
            commentDate: postData.createdAt,
          },
        ]);

        setEditPostDetails({
          editCaption: newCaption,
          editLocation: newLocation.label || '',
        });

        if (editPostDetailsConfirm.postLocation) {
          if (editPostDetailsConfirm.postLocation.label) {
            const slugifiedString = slugify(
              editPostDetailsConfirm.postLocation.label,
              {
                lower: true,
                strict: true,
              }
            );
            setSlugifiedLocationLabel(slugifiedString);
          }

          dispatch(
            setLocationCoordinates({
              latitude: editPostDetailsConfirm.postLocation.latitude,
              longitude: editPostDetailsConfirm.postLocation.longitude,
            })
          );
        }
      } else {
        setCaptionInfoArray([]);
      }

      getSinglePostDataStart({ postId: editPostDetailsConfirm.id });
    }
  }, [
    dispatch,
    postData,
    otherUser,
    otherUserProfilePhotoFile,
    editPostDetailsConfirm,
  ]);

  useEffect(() => {
    if (!areReactionsReadyForRendering && postId) {
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [dispatch, areReactionsReadyForRendering, postId]);

  useEffect(() => {
    if (
      postReactionsArray &&
      postReactionsArray.length &&
      !areReactionsReadyForRendering
    ) {
      postReactionsArray.forEach((innerArray) => {
        if (innerArray.length && innerArray[0]!.postId === postId) {
          if (!compareUserOrPostOrReactionArrays(reactionsArray, innerArray)) {
            setReactionsArray(innerArray);
          }
        }
      });
    } else if (postReactionsArray && !postReactionsArray.length) {
      setReactionsArray([]);
      setUniqueReactingUsers(new Set());
      setReactingUsersInfoArray([]);
      setLikingUsersArray([]);
      setCommentingUserArray([]);
    }
  }, [
    areReactionsReadyForRendering,
    postId,
    postReactionsArray,
    reactionsArray,
  ]);

  useEffect(() => {
    if (
      currentUser &&
      reactionsArray.length &&
      !areReactionsReadyForRendering
    ) {
      const foundPost = reactionsArray.find(
        (el) => el.reactingUserId === currentUser.id && el.likedPost
      );

      if (foundPost) {
        setAlreadyLikedPostAndReactionId({
          alreadyLikedPost: true,
          reactionId: foundPost.id,
        });
      } else {
        setAlreadyLikedPostAndReactionId({
          alreadyLikedPost: false,
          reactionId: 'no-post-found',
        });
      }
    }
  }, [areReactionsReadyForRendering, currentUser, reactionsArray]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });

      setLikingUsersArray([]);
      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [dispatch, postId, postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });

      setLikingUsersArray([]);
      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [deleteReactionConfirm, dispatch, postId]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      postId &&
      postReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [dispatch, postId, postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      postId &&
      deleteReactionConfirm.postId === postId
    ) {
      dispatch(clearPostReactions());

      setAreReactionsReadyForRendering(false);
      dispatch(
        getPostReactionsStart({
          postId: postId,
          reactionReqType: ReactionRequestType.singlePost,
        })
      );
    }
  }, [deleteReactionConfirm, dispatch, postId]);

  useEffect(() => {
    if (reactionsArray.length && !areReactionsReadyForRendering) {
      reactionsArray.forEach((el) => {
        dispatch(
          getOtherUserStart({
            type: OtherUserType.POST_REACTOR,
            usernameOrId: el.reactingUserId,
          })
        );

        setUniqueReactingUsers(uniqueReactingUsers.add(el.reactingUserId));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, areReactionsReadyForRendering, reactionsArray]);

  useEffect(() => {
    if (postReactingUsers && postReactingUsers.length) {
      setReactingUsersInfoArray(postReactingUsers);
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoArray.length && !areReactionsReadyForRendering) {
      reactingUserInfoArray.forEach((el) => {
        if (el.photo) {
          dispatch(
            getPostFileStart({
              s3Key: el.photo,
              bucket: profileBucket,
              user: UserType.postReactorsArray,
              fileRequestType: FileRequestType.singlePost,
            })
          );
        } else {
          dispatch(
            getUserPhotoForReactorArraySuccess({ s3Key: '', fileString: '' })
          );
        }
      });
    }
  }, [
    dispatch,
    areReactionsReadyForRendering,
    profileBucket,
    reactingUserInfoArray,
  ]);

  useEffect(() => {
    if (
      reactionsArray.length &&
      reactingUserInfoArray.length &&
      uniqueReactingUsers.size &&
      reactingUserInfoArray.length >= uniqueReactingUsers.size &&
      reactorPhotoFileArray?.length &&
      reactingUserInfoArray.length === reactorPhotoFileArray?.length &&
      !areReactionsReadyForRendering
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      reactionsArray.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let fileString: string;

        reactingUserInfoArray.forEach((infoEl) => {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        });

        reactorPhotoFileArray.forEach((photoEl) => {
          if (photoEl.s3Key === photoKey) {
            fileString = photoEl.fileString;
          }
        });

        if (!photoKey!) {
          fileString = '';
        }

        if (!comment) {
          comment = '';
        }

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment: '',
            location: {} as Location,
            reactionId: reactionEl.id,
            postId: postId,
          });
        } else {
          commentsArray.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment,
            location: {} as Location,
            commentDate: reactionEl.createdAt,
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
            postId: postId,
          });
        }
      });

      if (
        !compareUserInfoAndDataObjArrays(commentingUserArray, commentsArray)
      ) {
        setCommentingUserArray(commentsArray);
      }

      if (!compareUserInfoAndDataObjArrays(likingUsersArray, likesArray)) {
        setLikingUsersArray(likesArray);
        setPostLikingUsersArray(likesArray);
      }

      setAreReactionsReadyForRendering(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reactionsArray,
    uniqueReactingUsers,
    reactingUserInfoArray,
    reactorPhotoFileArray,
  ]);

  const handleSetIsCurrentUserPost = (postData: Post) => {
    if (currentUser) {
      if (postData.userId === currentUser.id) {
        setIsCurrentUserPost(true);
      } else {
        setIsCurrentUserPost(false);
      }
    }
  };

  useEffect(() => {
    const handleSetIsCurrentUserComment = () => {
      if (currentUser && commentToDelete && commentToDelete.reactingUserId) {
        if (commentToDelete.reactingUserId === currentUser.id) {
          setIsCurrentUserComment(true);
        } else {
          setIsCurrentUserComment(false);
        }
      }
    };

    handleSetIsCurrentUserComment();
  }, [commentToDelete, currentUser, showCommentOptionsModal]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setComment(value);
  };

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (postId && currentUser && comment) {
      dispatch(
        createPostReactionStart({
          reactingUserId: currentUser.id,
          postId: postId,
          likedPost: false,
          comment,
        })
      );

      if (otherUser) {
        dispatch(
          postNotificationStart({
            fromUserId: currentUser.id,
            toUserId: otherUser.id,
            message: `${currentUser.username} commented: ${comment}`,
            postId,
          })
        );
      }
    }
    setComment('');
  };

  const handleRenderLikeOrLikedButton = () => {
    return (
      <Button className='like-button' onClick={handleClickLikeButton}>
        {alreadyLikedPostAndReactionId.alreadyLikedPost ? (
          <FavoriteIcon htmlColor='red' />
        ) : (
          <FavoriteBorderIcon />
        )}
      </Button>
    );
  };

  const handleClickLikeButton = () =>
    alreadyLikedPostAndReactionId.alreadyLikedPost
      ? handleSubmitRemoveLike()
      : handleSubmitLike();

  const handleSubmitLike = () => {
    if (postId && currentUser) {
      dispatch(
        createPostReactionStart({
          reactingUserId: currentUser.id,
          postId: postId,
          likedPost: true,
          comment: '',
        })
      );

      if (otherUser) {
        dispatch(
          postNotificationStart({
            fromUserId: currentUser.id,
            toUserId: otherUser.id,
            message: `${currentUser.username} liked your post.`,
            postId,
          })
        );
      }
    }
  };

  const handleSubmitRemoveLike = () => {
    postId &&
      dispatch(
        deleteReactionStart({
          reactionId: alreadyLikedPostAndReactionId.reactionId,
          isLikeRemoval: true,
          postId: postId,
        })
      );
  };

  const handleRenderEditPostDetails = () => {
    if (isCurrentUserPost && !showPostEditForm) {
      return (
        <span className='post-page-edit-post' onClick={handleShowPostEditForm}>
          Edit post details
        </span>
      );
    } else if (postId && isCurrentUserPost && showPostEditForm) {
      return (
        <EditPostForm
          postId={postId}
          editCaption={editPostDetails.editCaption}
          editLocation={editPostDetails.editLocation}
        />
      );
    } else return null;
  };

  const handleShowPostEditForm = () => dispatch(setShowPostEditForm(true));

  const handleShowPostLikingUsersModal = () =>
    setShowPostLikingUsersModal(true);

  const handleSetShowPostOptionsModal = () => setShowPostOptionsModal(true);

  const handleArchivePost = () => {
    if (postId && postData) {
      dispatch(
        archivePostStart({
          postId,
          s3Key: postData.s3Key,
        })
      );
    }
  };

  const handleArchiveComment = () => {
    if (commentToDelete) {
      dispatch(deleteReactionStart(commentToDelete));
    }
    dispatch(setShowCommentOptionsModal(false));
  };

  const handleHidePostLikingUsersModal = () =>
    setShowPostLikingUsersModal(false);

  const handleHidePostOptionsModal = () => setShowPostOptionsModal(false);

  const handleHideCommentOptionsModal = () =>
    dispatch(setShowCommentOptionsModal(false));

  const handleClickPlayArrowIcon = () => setPlayVideo(true);

  return (
    <div className='post-page' data-testid='post-page'>
      <div className='post-container'>
        <div className='post-media-container'>
          {!playVideo && postFiles.length ? (
            <>
              <img
                className='post-image'
                src={`data:image/jpeg;base64,${postFiles[0].fileString}`}
                alt='post-pic'
              />
              {postData?.isVideo && (
                <PlayArrowIcon
                  className='play-arrow-icon'
                  onClick={handleClickPlayArrowIcon}
                />
              )}
            </>
          ) : null}
          {!postFiles.length && !postData?.isVideo && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '10px',
                paddingBottom: '10px',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {postData && playVideo && (
            <video className='post-video' controls muted>
              <source src={`/api/posts/video?s3Key=${postData.s3Key}`} />
            </video>
          )}
        </div>
        <div className='post-page-details'>
          <div className='post-page-user-and-location'>
            {otherUserProfilePhotoFile ? (
              <img
                className='user-photo'
                src={`data:image/jpeg;base64,${otherUserProfilePhotoFile.fileString}`}
                alt='user'
              />
            ) : null}
            {!otherUserProfilePhotoFile && isLoadingPostData ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  marginLeft: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {!otherUserProfilePhotoFile && !isLoadingPostData ? (
              <div className='user-photo-placeholder'>
                <p className='user-photo-placeholder-text'>No photo</p>
              </div>
            ) : null}
            <div className='text-and-options'>
              <div className='user-and-location'>
                {otherUser ? (
                  <span className='user-name'>{otherUser.username}</span>
                ) : null}
                <NavLink
                  to={`/explore/locations/${
                    postData?.postLocation?.id || ''
                  }/${slugifiedLocationLabel}`}
                  className='post-page-location'
                >
                  {editPostDetails?.editLocation || null}
                </NavLink>
              </div>
              <button
                className='post-page-options'
                onClick={handleSetShowPostOptionsModal}
              >
                <MoreHorizIcon className='ellipsis' />
              </button>
            </div>
          </div>
          <div className='post-page-caption-and-comments-container'>
            {captionInfoArray.length && !showPostEditForm ? (
              <UserInfo
                styleType={StyleType.postPage}
                userInfoArray={captionInfoArray}
                isCaption
                isCaptionOwner={isCurrentUserPost ? true : false}
              />
            ) : (
              handleRenderEditPostDetails()
            )}
            {!areReactionsReadyForRendering && reactionsArray.length ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : null}
            {commentingUserArray.length ? (
              <UserInfo
                styleType={StyleType.postPage}
                userInfoArray={commentingUserArray}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersArray.length ? (
            <Button className='likes' onClick={handleShowPostLikingUsersModal}>
              <span>{`${likingUsersArray.length} likes`}</span>
            </Button>
          ) : null}
          {postData ? (
            <span className='post-page-post-date'>
              {new Date(postData.createdAt).toDateString()}
            </span>
          ) : null}
          <form
            className='post-page-comment-form'
            onSubmit={handleSubmitComment}
          >
            <ExpandableFormInput
              tall={true}
              onChange={handleChange}
              name='comment'
              type='textarea'
              value={comment}
              label='Add a comment...'
            />
            <Button
              className={`${
                !comment ? 'greyed-out ' : ''
              }post-page-submit-comment-button`}
              disabled={comment ? false : true}
              onClick={handleSubmitComment}
            >
              <span>Post</span>
            </Button>
          </form>
        </div>
      </div>
      {likingUsersArray.length ? (
        <FollowersOrFollowingOrLikesModal
          currentOrOtherUser='current'
          show={showPostLikingUsersModal}
          onHide={handleHidePostLikingUsersModal}
          isPostLikingUsersModal={true}
          postLikingUsersArray={likingUsersArray}
        />
      ) : null}
      <PostOrCommentOptionsModal
        show={showPostOptionsModal}
        onHide={handleHidePostOptionsModal}
        isCurrentUserPostOrComment={isCurrentUserPost}
        postOptionsModal={true}
        isInPostPage={true}
        archive={handleArchivePost}
      />
      <PostOrCommentOptionsModal
        show={showCommentOptionsModal}
        onHide={handleHideCommentOptionsModal}
        archive={handleArchiveComment}
        isCurrentUserPostOrComment={isCurrentUserComment}
        postOptionsModal={false}
      />
    </div>
  );
};

export default PostPage;
