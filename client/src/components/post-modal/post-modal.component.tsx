import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { AppState } from '../../redux/root-reducer';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectPostReactingUsers,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Reaction,
  ReactionReq,
  ReactionConfirm,
  DeleteReactionReq,
  DeleteReactionConfirm,
  Post,
  PostError,
  PostFileReq,
  FileRequestType,
  PostFile,
  GetPostReactionsReq,
  ReactionRequestType,
  UserType,
  SinglePostDataReq,
} from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectReactorPhotoFileArray,
  selectUsersProfilePhotoConfirm,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
  selectDeleteReactionConfirm,
  selectDeleteReactionError,
  selectShowPostEditForm,
  selectEditPostDetailsConfirm,
} from '../../redux/post/post.selectors';
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
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import Modal from 'react-bootstrap/Modal';
import Button from '../button/button.component';
import { ExpandableFormInput } from '../form-input/form-input.component';
import EditPostForm from '../edit-post-form/edit-post-form.component';

import {
  compareUserOrPostOrReactionLists,
  compareUserInfoAndDataObjLists,
} from '../../pages/feed-page/feed-page.utils';

import './post-modal.styles.scss';

export interface AlreadyLikedAndReactionId {
  alreadyLikedPost: boolean;
  reactionId: string;
}

interface PostModalProps {
  currentUser: User | null;
  isCurrentUserPost?: boolean;
  postId: string;
  caption: string;
  createdAt: Date | string;
  location: string;
  show: boolean;
  clearLocalState: boolean;
  onHide: () => void;
  fileString: string;
  userName: string;
  userId: string;
  onOptionsClick: () => void;
  onPostLikingUsersClick?: () => void;
  userProfilePhotoFile: string;
  postReactionsArray: Reaction[][];
  postReactionConfirm: ReactionConfirm | null;
  postReactionError: PostError | null;
  postReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: DeleteReactionConfirm | null;
  deleteReactionError: PostError | null;
  showPostEditForm: boolean;
  editPostDetailsConfirm: Post | null;
  createPostReactionStart: typeof createPostReactionStart;
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
  currentUser,
  isCurrentUserPost,
  postId,
  fileString,
  caption,
  location,
  createdAt,
  userName,
  userId,
  onOptionsClick,
  onPostLikingUsersClick,
  userProfilePhotoFile,
  postReactionsArray,
  postReactingUsers,
  reactorPhotoFileArray,
  usersProfilePhotoConfirm,
  postReactionConfirm,
  deleteReactionConfirm,
  showPostEditForm,
  editPostDetailsConfirm,
  clearPostReactions,
  createPostReactionStart,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  setShowPostEditForm,
  getSinglePostDataStart,
  ...props
}) => {
  const [localPostId, setLocalPostId] = useState(postId);

  const [comment, setComment] = useState('');

  const [captionInfoList, setCaptionInfoList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [reactionsList, setReactionsList] = useState<List<Reaction>>(List());

  const [uniqueReactingUsers, setUniqueReactingUsers] = useState<Set<string>>(
    new Set()
  );

  const [reactingUserInfoList, setReactingUsersInfoList] = useState<List<User>>(
    List()
  );

  const [userProfilePhotoList, setUserProfilePhotoList] = useState<
    List<PostFile>
  >(List());

  const [commentingUserList, setCommentingUserList] = useState<
    List<UserInfoAndOtherData>
  >(List());

  const [likingUsersList, setLikingUsersList] = useState<
    List<UserInfoAndOtherData>
  >(List());

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

  const postModalDataCache = useSelector(
    (state: AppState) => state.post.postModalDataCache
  );

  const dispatch = useDispatch();

  const urlLocation = useLocation();

  const postDate = new Date(createdAt).toDateString();

  let bucket: string;

  process.env.NODE_ENV === 'production'
    ? (bucket = 'photo-share-app-profile-photos')
    : (bucket = 'photo-share-app-profile-photos-dev');

  let shiftRight: boolean;
  process.env.NODE_ENV === 'development'
    ? (shiftRight = true)
    : (shiftRight = false);

  useEffect(() => {
    if (props.show && postId) {
      window.history.pushState({}, '', `p/${postId}`);
    } else if (!props.show) {
      if (urlLocation.pathname === '/') {
        window.history.pushState({}, '', '/');
      } else {
        window.history.pushState({}, '', `${urlLocation.pathname}`);
      }
    }
  }, [props.show, postId]);

  useEffect(() => {
    setReactionsList(List());
    clearPostState();

    if (postId !== localPostId) {
      setLocalPostId(postId);
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setCaptionInfoList(List());
      setCommentingUserList(List());
      setLikingUsersList(List());
      setAreReactionsReadyForRendering(false);
      setEditPostDetails({
        editCaption: '',
        editLocation: '',
      });
    }
  }, [postId]);

  useEffect(() => {
    caption
      ? setCaptionInfoList(
          List([
            {
              username: userName,
              name: '',
              profilePhotoFileString: userProfilePhotoFile,
              comment: caption,
              location: '',
              commentDate: createdAt,
            },
          ])
        )
      : setCaptionInfoList(List());
  }, [caption]);

  useEffect(() => {
    setEditPostDetails({ editCaption: caption, editLocation: location });
  }, [caption, location]);

  useEffect(() => {
    if (editPostDetailsConfirm) {
      let newCaption = editPostDetailsConfirm.caption || '';
      let newLocation = editPostDetailsConfirm.postLocation || '';

      if (newCaption) {
        setCaptionInfoList(
          List([
            {
              username: userName,
              name: '',
              profilePhotoFileString: userProfilePhotoFile,
              comment: newCaption,
              location: newLocation,
              commentDate: createdAt,
            },
          ])
        );

        setEditPostDetails({
          editCaption: newCaption,
          editLocation: newLocation,
        });
      } else {
        setCaptionInfoList(List());
      }

      getSinglePostDataStart({ postId: editPostDetailsConfirm.id });
    }
  }, [editPostDetailsConfirm]);

  useEffect(() => {
    if (postModalDataCache.get(localPostId) && !areReactionsReadyForRendering) {
      setCommentingUserList(
        postModalDataCache.get(localPostId).commentingUserList
      );

      const likersList = postModalDataCache.get(localPostId).likingUsersList;

      setLikingUsersList(likersList);
      setPostLikingUsersArray(likersList.toArray());
      setAlreadyLikedPostAndReactionId(
        postModalDataCache.get(localPostId).alreadyLikedPostAndReactionId
      );

      setAreReactionsReadyForRendering(true);
    }
  }, [localPostId]);

  useEffect(() => {
    if (
      localPostId &&
      !postModalDataCache.get(localPostId) &&
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
      !postModalDataCache.get(localPostId)
    ) {
      postReactionsArray.forEach((innerArray) => {
        let innerArrayAsList = List(innerArray);

        if (
          innerArrayAsList.size &&
          innerArrayAsList.get(0)!.postId === localPostId
        ) {
          if (
            !compareUserOrPostOrReactionLists(reactionsList, innerArrayAsList)
          ) {
            setReactionsList(innerArrayAsList);
          }
        }
      });
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (
      currentUser &&
      reactionsList.size &&
      !areReactionsReadyForRendering &&
      !postModalDataCache.get(localPostId)
    ) {
      const foundPost = reactionsList.find(
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
  }, [reactionsList]);

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

      setLikingUsersList(List());
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

      setLikingUsersList(List());
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
      reactionsList.size &&
      !areReactionsReadyForRendering &&
      !postModalDataCache.get(localPostId)
    ) {
      reactionsList.forEach((el) => {
        getOtherUserStart({
          type: OtherUserType.POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });

        setUniqueReactingUsers(uniqueReactingUsers.add(el.reactingUserId));
      });
    }
  }, [reactionsList]);

  useEffect(() => {
    if (
      postReactingUsers &&
      postReactingUsers.length &&
      !postModalDataCache.get(localPostId)
    ) {
      setReactingUsersInfoList(List(postReactingUsers));
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (
      reactingUserInfoList.size &&
      !areReactionsReadyForRendering &&
      !postModalDataCache.get(localPostId)
    ) {
      reactingUserInfoList.forEach((el) => {
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
  }, [reactingUserInfoList]);

  useEffect(() => {
    if (reactorPhotoFileArray) {
      setUserProfilePhotoList(List(reactorPhotoFileArray));
    }
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsList.size &&
      reactingUserInfoList.size &&
      uniqueReactingUsers.size &&
      reactingUserInfoList.size >= uniqueReactingUsers.size &&
      userProfilePhotoList.size &&
      reactingUserInfoList.size === userProfilePhotoList.size &&
      !areReactionsReadyForRendering &&
      !postModalDataCache.get(localPostId)
    ) {
      let commentsList: List<UserInfoAndOtherData> = List();
      let likesList: List<UserInfoAndOtherData> = List();

      reactionsList.forEach((reactionEl) => {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let fileString: string;

        reactingUserInfoList.forEach((infoEl) => {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        });

        userProfilePhotoList.forEach((photoEl) => {
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
          likesList = likesList.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment: '',
            location: '',
            reactionId: reactionEl.id,
            postId: localPostId,
          });
        } else {
          commentsList = commentsList.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment,
            location: '',
            commentDate: reactionEl.createdAt,
            reactionId: reactionEl.id,
            reactingUserId: reactionEl.reactingUserId,
            postId: localPostId,
          });
        }
      });

      if (!compareUserInfoAndDataObjLists(commentingUserList, commentsList)) {
        setCommentingUserList(commentsList);
      }

      if (!compareUserInfoAndDataObjLists(likingUsersList, likesList)) {
        setLikingUsersList(likesList);
        setPostLikingUsersArray(likesList.toArray());
      }

      setAreReactionsReadyForRendering(true);
    }
  }, [
    reactionsList,
    uniqueReactingUsers,
    reactingUserInfoList,
    userProfilePhotoList,
  ]);

  useEffect(() => {
    if (
      areReactionsReadyForRendering &&
      alreadyLikedPostAndReactionId.reactionId &&
      !postModalDataCache.get(localPostId)
    ) {
      dispatch(
        savePostModalDataToCache({
          postId: localPostId,
          cacheObj: {
            commentingUserList,
            likingUsersList,
            alreadyLikedPostAndReactionId,
          },
        })
      );
    }
  }, [
    commentingUserList,
    likingUsersList,
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
      createPostReactionStart({
        reactingUserId: userId,
        postId: localPostId,
        likedPost: false,
        comment,
      });
    }
    setComment('');
  };

  const handleRenderLikeOrLikedButton = () => {
    return (
      <Button
        className='like-button'
        onClick={
          alreadyLikedPostAndReactionId.alreadyLikedPost
            ? () => handleSubmitRemoveLike()
            : () => handleSubmitLike()
        }
      >
        {alreadyLikedPostAndReactionId.alreadyLikedPost ? (
          <FavoriteIcon className='likes-icon' htmlColor='red' />
        ) : (
          <FavoriteBorderIcon className='likes-icon' />
        )}
      </Button>
    );
  };

  const handleSubmitLike = () => {
    createPostReactionStart({
      reactingUserId: userId,
      postId: localPostId,
      likedPost: true,
      comment: '',
    });
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
        <span className='edit-post' onClick={() => setShowPostEditForm(true)}>
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

  return (
    <Modal
      {...props}
      dialogClassName={`${shiftRight ? 'shift-right' : ''} : post-modal`}
      animation={false}
      centered
    >
      <div className='large-image-adjustments'>
        <img
          className='post-modal-image-large'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='post-pic'
        />
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
            <img
              className='user-photo'
              src={`data:image/jpeg;base64,${userProfilePhotoFile}`}
              alt='user'
            />
            <div className='text-and-options'>
              <div className='user-and-location'>
                <span className='user-name'>{userName}</span>
                <span className='post-location'>
                  {editPostDetails.editLocation}
                </span>
              </div>
              <button className='post-options' onClick={onOptionsClick}>
                <MoreHorizIcon className='ellipsis' />
              </button>
            </div>
          </div>
          <div className='caption-and-comments-container'>
            {captionInfoList.size && !showPostEditForm ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoList={captionInfoList}
                isCaption
                isCaptionOwner={isCurrentUserPost ? true : false}
              />
            ) : (
              handleRenderEditPostDetails()
            )}
            {!areReactionsReadyForRendering && reactionsList.size ? (
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
            {commentingUserList.size ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoList={commentingUserList}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersList.size ? (
            <Button className='likes' onClick={onPostLikingUsersClick}>
              <span>{`${likingUsersList.size} likes`}</span>
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
            >
              <span>Post</span>
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postReactionsArray: Reaction[][];
  postReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  postReactionConfirm: ReactionConfirm | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  deleteReactionConfirm: DeleteReactionConfirm | null;
  deleteReactionError: PostError | null;
  showPostEditForm: boolean;
  editPostDetailsConfirm: Post | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postReactionsArray: selectPostReactionsArray,
  postReactingUsers: selectPostReactingUsers,
  reactorPhotoFileArray: selectReactorPhotoFileArray,
  usersProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
  postReactionConfirm: selectPostReactionConfirm,
  postReactionError: selectPostReactionError,
  getPostReactionsConfirm: selectGetPostReactionsConfirm,
  getPostReactionsError: selectGetPostReactionsError,
  deleteReactionConfirm: selectDeleteReactionConfirm,
  deleteReactionError: selectDeleteReactionError,
  showPostEditForm: selectShowPostEditForm,
  editPostDetailsConfirm: selectEditPostDetailsConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostReactionStart: (reactionReq: ReactionReq) =>
    dispatch(createPostReactionStart(reactionReq)),
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

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
