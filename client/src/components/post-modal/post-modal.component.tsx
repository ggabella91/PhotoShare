import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import slugify from 'slugify';

import { AppState } from '../../redux/root-reducer';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';

import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Reaction,
  DeleteReactionReq,
  PostFileReq,
  FileRequestType,
  GetPostReactionsReq,
  ReactionRequestType,
  UserType,
  SinglePostDataReq,
  Location,
} from '../../redux/post/post.types';

import {
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  getUserPhotoForReactorArraySuccess,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostEditForm,
  getSinglePostDataStart,
  savePostModalDataToCache,
  removePostModalDataFromCache,
  clearPostState,
  setLocationCoordinates,
  clearSinglePostData,
} from '../../redux/post/post.actions';

import { postNotificationStart } from '../../redux/follower/follower.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import Modal from 'react-bootstrap/Modal';
import Button from '../button/button.component';
import { ExpandableFormInput } from '../form-input/form-input.component';
import EditPostForm from '../edit-post-form/edit-post-form.component';

import {
  compareUserInfoAndDataObjArrays,
  compareUserOrPostOrReactionArrays,
} from '../../pages/feed-page/feed-page.utils';

import './post-modal.styles.scss';

export interface AlreadyLikedAndReactionId {
  alreadyLikedPost: boolean;
  reactionId: string;
}

interface PostModalProps {
  isCurrentUserPost?: boolean;
  postId: string;
  caption: string;
  createdAt: Date | string;
  location: Location | null;
  show: boolean;
  isVideo?: boolean;
  s3Key?: string;
  clearLocalState: boolean;
  onHide: () => void;
  fileString: string;
  userName: string;
  userId: string;
  onOptionsClick: () => void;
  onPostLikingUsersClick?: () => void;
  userProfilePhotoFile: string;
  getPostReactionsStart: typeof getPostReactionsStart;
  getPostFileStart: typeof getPostFileStart;
  getOtherUserStart: typeof getOtherUserStart;
  deleteReactionStart: typeof deleteReactionStart;
  setPostLikingUsersArray: typeof setPostLikingUsersArray;
  clearPostReactions: typeof clearPostReactions;
  setShowPostEditForm: typeof setShowPostEditForm;
  getSinglePostDataStart: typeof getSinglePostDataStart;
  clearPostState: typeof clearPostState;
}

export const PostModal: React.FC<PostModalProps> = ({
  clearLocalState,
  isCurrentUserPost,
  postId,
  isVideo,
  s3Key,
  fileString,
  caption,
  location,
  createdAt,
  userName,
  userId,
  onOptionsClick,
  onPostLikingUsersClick,
  userProfilePhotoFile,
  clearPostReactions,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  setShowPostEditForm,
  getSinglePostDataStart,
  clearPostState,
  ...props
}) => {
  const [localPostId, setLocalPostId] = useState(postId);

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

  const [slugifiedLocationLabel, setSlugifiedLocationLabel] = useState('');

  const [playVideo, setPlayVideo] = useState(false);

  const postState = useSelector((state: AppState) => state.post);
  const userState = useSelector((state: AppState) => state.user);

  const {
    postModalDataCache,
    postReactionsArray,
    reactorPhotoFileArray,
    postReactionConfirm,
    deleteReactionConfirm,
    showPostEditForm,
    editPostDetailsConfirm,
  } = postState;
  const { currentUser, postReactingUsers } = userState;

  const dispatch = useDispatch();

  const urlLocation = useLocation();

  const postDate = new Date(createdAt).toDateString();

  let bucket: string;

  process.env.NODE_ENV === 'production'
    ? (bucket = 'photo-share-app-profile-photos')
    : (bucket = 'photo-share-app-profile-photos-dev');

  useEffect(() => {
    if (props.show && postId) {
      window.history.pushState({}, '', `/p/${postId}`);
    } else if (!props.show) {
      if (urlLocation.pathname === '/') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `${urlLocation.pathname}`);
      }
    }
  }, [props.show, postId]);

  useEffect(() => {
    setReactionsArray([]);
    dispatch(clearSinglePostData());
    setPlayVideo(false);

    if (postId !== localPostId) {
      setLocalPostId(postId);
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setCaptionInfoArray([]);
      setCommentingUserArray([]);
      setLikingUsersArray([]);
      setAreReactionsReadyForRendering(false);
      setEditPostDetails({
        editCaption: '',
        editLocation: '',
      });
    }
  }, [postId]);

  useEffect(() => {
    caption
      ? setCaptionInfoArray([
          {
            username: userName,
            name: '',
            profilePhotoFileString: userProfilePhotoFile,
            comment: caption,
            location: {} as Location,
            commentDate: createdAt,
          },
        ])
      : setCaptionInfoArray([]);
  }, [caption, userProfilePhotoFile]);

  useEffect(() => {
    setEditPostDetails({
      editCaption: caption,
      editLocation: location?.label || '',
    });

    if (location?.label) {
      const slugifiedString = slugify(location?.label, {
        lower: true,
        strict: true,
      });
      setSlugifiedLocationLabel(slugifiedString);
    }

    if (location?.latitude && location?.longitude) {
      dispatch(
        setLocationCoordinates({
          latitude: location?.latitude,
          longitude: location?.longitude,
        })
      );
    }
  }, [caption, location]);

  useEffect(() => {
    if (editPostDetailsConfirm) {
      let newCaption = editPostDetailsConfirm.caption || '';
      let newLocation = editPostDetailsConfirm.postLocation || ({} as Location);

      if (newCaption) {
        setCaptionInfoArray([
          {
            username: userName,
            name: '',
            profilePhotoFileString: userProfilePhotoFile,
            comment: newCaption,
            location: newLocation,
            commentDate: createdAt,
          },
        ]);

        setEditPostDetails({
          editCaption: newCaption,
          editLocation: newLocation.label || '',
        });

        if (newLocation.label) {
          const slugifiedString = slugify(newLocation.label, {
            lower: true,
            strict: true,
          });
          setSlugifiedLocationLabel(slugifiedString);
        }

        if (newLocation.latitude && newLocation.longitude) {
          dispatch(
            setLocationCoordinates({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            })
          );
        }
      } else {
        setCaptionInfoArray([]);
      }

      getSinglePostDataStart({ postId: editPostDetailsConfirm.id });
    }
  }, [editPostDetailsConfirm]);

  useEffect(() => {
    if (postModalDataCache?.[localPostId] && !areReactionsReadyForRendering) {
      setCommentingUserArray(
        postModalDataCache?.[localPostId].commentingUserArray
      );

      const likersArray = postModalDataCache?.[localPostId].likingUsersArray;

      setLikingUsersArray(likersArray);
      setPostLikingUsersArray(likersArray);
      setAlreadyLikedPostAndReactionId(
        postModalDataCache?.[localPostId].alreadyLikedPostAndReactionId
      );

      setAreReactionsReadyForRendering(true);
    }
  }, [localPostId]);

  useEffect(() => {
    if (
      localPostId &&
      !postModalDataCache?.[localPostId] &&
      !areReactionsReadyForRendering
    ) {
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [localPostId]);

  useEffect(() => {
    if (
      postReactionsArray &&
      postReactionsArray.length &&
      !areReactionsReadyForRendering &&
      !postModalDataCache?.[localPostId]
    ) {
      postReactionsArray.forEach((innerArray) => {
        if (innerArray.length && innerArray[0]!.postId === localPostId) {
          if (!compareUserOrPostOrReactionArrays(reactionsArray, innerArray)) {
            setReactionsArray(innerArray);
          }
        }
      });
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (
      currentUser &&
      reactionsArray.length &&
      !areReactionsReadyForRendering &&
      !postModalDataCache?.[localPostId]
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
  }, [reactionsArray]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      localPostId &&
      postReactionConfirm.postId === localPostId
    ) {
      clearPostReactions();

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });

      setLikingUsersArray([]);
      dispatch(removePostModalDataFromCache(localPostId));
      setAreReactionsReadyForRendering(false);
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      localPostId &&
      deleteReactionConfirm.postId === localPostId
    ) {
      clearPostReactions();

      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });

      setLikingUsersArray([]);
      dispatch(removePostModalDataFromCache(localPostId));
      setAreReactionsReadyForRendering(false);
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      localPostId &&
      postReactionConfirm.postId === localPostId
    ) {
      clearPostReactions();

      dispatch(removePostModalDataFromCache(localPostId));
      setAreReactionsReadyForRendering(false);
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      localPostId &&
      deleteReactionConfirm.postId === localPostId
    ) {
      clearPostReactions();

      dispatch(removePostModalDataFromCache(localPostId));
      setAreReactionsReadyForRendering(false);
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      reactionsArray.length &&
      !areReactionsReadyForRendering &&
      !postModalDataCache?.[localPostId]
    ) {
      reactionsArray.forEach((el) => {
        getOtherUserStart({
          type: OtherUserType.POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });

        setUniqueReactingUsers(uniqueReactingUsers.add(el.reactingUserId));
      });
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (
      postReactingUsers &&
      postReactingUsers.length &&
      !postModalDataCache?.[localPostId]
    ) {
      setReactingUsersInfoArray(postReactingUsers);
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (
      reactingUserInfoArray.length &&
      !areReactionsReadyForRendering &&
      !postModalDataCache?.[localPostId]
    ) {
      reactingUserInfoArray.forEach((el) => {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
            fileRequestType: FileRequestType.singlePost,
          });
        } else {
          dispatch(
            getUserPhotoForReactorArraySuccess({ s3Key: '', fileString: '' })
          );
        }
      });
    }
  }, [reactingUserInfoArray]);

  useEffect(() => {
    if (
      reactionsArray.length &&
      reactingUserInfoArray.length &&
      uniqueReactingUsers.size &&
      reactingUserInfoArray.length >= uniqueReactingUsers.size &&
      reactorPhotoFileArray?.length &&
      reactingUserInfoArray.length === reactorPhotoFileArray?.length &&
      !areReactionsReadyForRendering &&
      !postModalDataCache?.[localPostId]
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      reactionsArray.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment || '';
        let photoKey: string;
        let fileString: string = '';

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

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment: '',
            location: {} as Location,
            reactionId: reactionEl.id,
            postId: localPostId,
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
            postId: localPostId,
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
  }, [
    reactionsArray,
    uniqueReactingUsers,
    reactingUserInfoArray,
    reactorPhotoFileArray,
  ]);

  useEffect(() => {
    if (
      areReactionsReadyForRendering &&
      alreadyLikedPostAndReactionId.reactionId &&
      !postModalDataCache?.[localPostId]
    ) {
      dispatch(
        savePostModalDataToCache({
          postId: localPostId,
          cacheObj: {
            commentingUserArray,
            likingUsersArray,
            alreadyLikedPostAndReactionId,
          },
        })
      );
    }
  }, [
    commentingUserArray,
    likingUsersArray,
    areReactionsReadyForRendering,
    alreadyLikedPostAndReactionId,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setComment(value);
  };

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (comment) {
      dispatch(
        createPostReactionStart({
          reactingUserId: userId,
          postId: localPostId,
          likedPost: false,
          comment,
        })
      );

      if (currentUser) {
        dispatch(
          postNotificationStart({
            fromUserId: currentUser.id,
            toUserId: userId,
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
          <FavoriteIcon className='likes-icon' htmlColor='red' />
        ) : (
          <FavoriteBorderIcon className='likes-icon' />
        )}
      </Button>
    );
  };

  const handleClickLikeButton = () =>
    alreadyLikedPostAndReactionId.alreadyLikedPost
      ? handleSubmitRemoveLike()
      : handleSubmitLike();

  const handleSubmitLike = () => {
    dispatch(
      createPostReactionStart({
        reactingUserId: userId,
        postId: localPostId,
        likedPost: true,
        comment: '',
      })
    );

    if (currentUser) {
      dispatch(
        postNotificationStart({
          fromUserId: currentUser.id,
          toUserId: userId,
          message: `${currentUser.username} liked your post.`,
          postId: localPostId,
        })
      );
    }
  };

  const handleSubmitRemoveLike = () => {
    deleteReactionStart({
      reactionId: alreadyLikedPostAndReactionId.reactionId,
      isLikeRemoval: true,
      postId: localPostId,
    });
  };

  const handleRenderEditPostDetails = () => {
    if (isCurrentUserPost && !showPostEditForm) {
      return (
        <span className='edit-post' onClick={handleShowPostEditForm}>
          Edit post details
        </span>
      );
    } else if (isCurrentUserPost && showPostEditForm) {
      return (
        <EditPostForm
          postId={localPostId}
          editCaption={editPostDetails.editCaption}
          editLocation={editPostDetails.editLocation}
        />
      );
    } else return null;
  };

  const handleShowPostEditForm = () => setShowPostEditForm(true);

  const handleClickPlayArrowIcon = () => setPlayVideo(true);

  return (
    <Modal
      {...props}
      dialogClassName={'shift-right post-modal'}
      animation={false}
      centered
    >
      <div className='large-media-adjustments'>
        {!playVideo ? (
          <>
            <img
              className='post-modal-image-large'
              src={`data:image/jpeg;base64,${fileString}`}
              alt='post-pic'
            />
            {isVideo && (
              <PlayArrowIcon
                className='play-arrow-icon'
                onClick={handleClickPlayArrowIcon}
              />
            )}
          </>
        ) : null}
        {playVideo && (
          <video className='post-modal-video' controls muted>
            <source src={`/api/posts/video?s3Key=${s3Key}`} />
          </video>
        )}
      </div>
      <Modal.Header className='post-modal-header' closeButton />
      <Modal.Body className='post-modal-body'>
        <img
          className='post-modal-image-embedded'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='post-pic'
        />
        <div className='post-modal-details'>
          <div className='post-user-and-location'>
            {userProfilePhotoFile ? (
              <img
                className='user-photo'
                src={`data:image/jpeg;base64,${userProfilePhotoFile}`}
                alt='user'
              />
            ) : (
              <div className='user-photo-placeholder'>
                <p className='user-photo-placeholder-text'>No photo</p>
              </div>
            )}
            <div className='text-and-options'>
              <div className='user-and-location'>
                <span className='user-name'>{userName}</span>
                <NavLink
                  to={`/explore/locations/${location?.id}/${slugifiedLocationLabel}`}
                  className='post-location'
                >
                  {editPostDetails.editLocation}
                </NavLink>
              </div>
              <button
                className='post-options'
                onClick={onOptionsClick}
                data-testid='options-button'
              >
                <MoreHorizIcon className='ellipsis' />
              </button>
            </div>
          </div>
          <div className='caption-and-comments-container'>
            {captionInfoArray.length && !showPostEditForm ? (
              <UserInfo
                styleType={StyleType.comment}
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
                styleType={StyleType.comment}
                userInfoArray={commentingUserArray}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersArray.length ? (
            <Button className='likes' onClick={onPostLikingUsersClick}>
              <span>{`${likingUsersArray.length} likes`}</span>
            </Button>
          ) : null}
          <span className='post-date'>{postDate}</span>
          <form className='comment-form' onSubmit={handleSubmitComment}>
            <ExpandableFormInput
              tall={true}
              onChange={handleChange}
              name='comment'
              type='textarea'
              value={comment}
              label='Add a comment...'
              modal={true}
            />
            <Button
              className={`${
                !comment ? 'greyed-out ' : ''
              }submit-comment-button`}
              disabled={comment ? false : true}
              onClick={handleSubmitComment}
              dataTestId='create-post-reaction-button'
            >
              <span>Post</span>
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostReactionsStart: (getPostReactionsReq: GetPostReactionsReq) =>
    dispatch(getPostReactionsStart(getPostReactionsReq)),
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
  deleteReactionStart: (deleteReactionReq: DeleteReactionReq) =>
    dispatch(deleteReactionStart(deleteReactionReq)),
  clearPostReactions: () => dispatch(clearPostReactions()),
  setPostLikingUsersArray: (postLikingUsersArray: UserInfoAndOtherData[]) =>
    dispatch(setPostLikingUsersArray(postLikingUsersArray)),
  setShowPostEditForm: (showPostEditForm: boolean) =>
    dispatch(setShowPostEditForm(showPostEditForm)),
  getSinglePostDataStart: (singlePostDataReq: SinglePostDataReq) =>
    dispatch(getSinglePostDataStart(singlePostDataReq)),
  clearPostState: () => dispatch(clearPostState()),
});

export default connect(null, mapDispatchToProps)(PostModal);
