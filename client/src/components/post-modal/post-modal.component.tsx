import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';

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
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostEditForm,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import Modal from 'react-bootstrap/Modal';
import Button from '../button/button.component';
import { ExpandableFormInput } from '../form-input/form-input.component';
import EditPostForm from '../edit-post-form/edit-post-form.component';

import './post-modal.styles.scss';

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
  ...props
}) => {
  const [localPostId, setLocalPostId] = useState(postId);

  const [comment, setComment] = useState('');

  const [captionInfoList, setCaptionInfoList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  const [reactionsList, setReactionsList] = useState<List<Reaction> | null>(
    null
  );

  const [reactingUserInfoList, setReactingUsersInfoList] =
    useState<List<User> | null>(null);

  const [userProfilePhotoList, setUserProfilePhotoList] =
    useState<List<PostFile> | null>(null);

  const [commentingUserList, setCommentingUserList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  const [likingUsersList, setLikingUsersList] =
    useState<List<UserInfoAndOtherData> | null>(null);

  const [alreadyLikedPostAndReactionId, setAlreadyLikedPostAndReactionId] =
    useState({ alreadyLikedPost: false, reactionId: '' });

  const [editPostDetails, setEditPostDetails] = useState({
    editCaption: '',
    editLocation: '',
  });

  const postDate = new Date(createdAt).toDateString();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (postId !== localPostId) {
      setLocalPostId(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (
      clearLocalState &&
      (reactionsList ||
        commentingUserList ||
        likingUsersList ||
        captionInfoList)
    ) {
      setReactionsList(null);
      setCaptionInfoList(null);
      setCommentingUserList(null);
      setLikingUsersList(null);
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setEditPostDetails({
        editCaption: '',
        editLocation: '',
      });
    }
  }, [localPostId]);

  useEffect(() => {
    if (caption) {
      setCaptionInfoList(
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
      );
    }
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
      } else {
        setCaptionInfoList(null);
      }

      setEditPostDetails({
        editCaption: newCaption,
        editLocation: newLocation,
      });
    }
  }, [editPostDetailsConfirm]);

  useEffect(() => {
    if (localPostId) {
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [localPostId]);

  useEffect(() => {
    if (postReactionsArray && postReactionsArray.length) {
      postReactionsArray.forEach((innerArray) => {
        if (innerArray.length && innerArray[0].postId === localPostId) {
          let innerList = List(innerArray);

          if (
            (reactionsList && !reactionsList.equals(innerList)) ||
            !reactionsList
          ) {
            setReactionsList(innerList);
          } else {
            return;
          }
        }
      });
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (reactionsList && reactionsList.size) {
      reactionsList.forEach((el) => {
        if (
          currentUser &&
          el.reactingUserId === currentUser.id &&
          el.likedPost
        ) {
          setAlreadyLikedPostAndReactionId({
            alreadyLikedPost: true,
            reactionId: el.id,
          });
        }
      });
    }
  }, [reactionsList]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      localPostId
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });
      setLikingUsersList(null);
      clearPostReactions();
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
      localPostId
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setLikingUsersList(null);
      clearPostReactions();
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
      localPostId
    ) {
      clearPostReactions();
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
      localPostId
    ) {
      clearPostReactions();
      getPostReactionsStart({
        postId: localPostId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (reactionsList && reactionsList.size) {
      reactionsList.forEach((el) => {
        getOtherUserStart({
          type: OtherUserType.POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });
      });
    }
  }, [reactionsList]);

  useEffect(() => {
    if (postReactingUsers && postReactingUsers.length) {
      setReactingUsersInfoList(List(postReactingUsers));
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoList && reactingUserInfoList.size) {
      reactingUserInfoList.forEach((el) => {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
            fileRequestType: FileRequestType.singlePost,
          });
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
      reactionsList &&
      reactionsList.size &&
      reactingUserInfoList &&
      reactingUserInfoList.size &&
      ((userProfilePhotoList && userProfilePhotoList.size) ||
        (!userProfilePhotoList &&
          usersProfilePhotoConfirm === 'User photo added to reactor array!'))
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

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

        if (userProfilePhotoList) {
          userProfilePhotoList.forEach((photoEl) => {
            if (photoEl.s3Key === photoKey!) {
              fileString = photoEl.fileString;
            }
          });
        }

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
            location: '',
            reactionId: reactionEl.id,
            postId: localPostId,
          });
        } else {
          commentsArray.push({
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

      setCommentingUserList(List(commentsArray));
      setLikingUsersList(List(likesArray));
      setPostLikingUsersArray(likesArray);
    }
  }, [reactionsList, reactingUserInfoList, userProfilePhotoList]);

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
        className='likes-text'
        onClick={
          alreadyLikedPostAndReactionId.alreadyLikedPost
            ? () => handleSubmitRemoveLike()
            : () => handleSubmitLike()
        }
      >
        <span>
          {alreadyLikedPostAndReactionId.alreadyLikedPost ? 'Liked' : 'Like'}
        </span>
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
    <Modal {...props} dialogClassName='post-modal' animation={false} centered>
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
              <div className='post-options'>
                <span className='ellipsis' onClick={onOptionsClick}>
                  ...
                </span>
              </div>
            </div>
          </div>
          <div className='caption-and-comments-container'>
            {captionInfoList && captionInfoList.size && !showPostEditForm ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoArray={captionInfoList.toArray()}
                isCaption
                isCaptionOwner={isCurrentUserPost ? true : false}
              />
            ) : (
              handleRenderEditPostDetails()
            )}
            {commentingUserList && commentingUserList.size ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoArray={commentingUserList.toArray()}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersList && likingUsersList.size ? (
            <Button className='likes-text' onClick={onPostLikingUsersClick}>
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
            />
            <Button
              className={`${
                !comment ? 'greyed-out' : ''
              } submit-comment-button`}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
