import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

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
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
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
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  getPostFileStart: typeof getPostFileStart;
  getOtherUserStart: typeof getOtherUserStart;
  deleteReactionStart: typeof deleteReactionStart;
  setPostLikingUsersArray: typeof setPostLikingUsersArray;
  clearPostReactions: typeof clearPostReactions;
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
  clearPostReactions,
  createPostReactionStart,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  ...props
}) => {
  const [comment, setComment] = useState('');

  const [captionInfoArray, setCaptionInfoArray] = useState<
    UserInfoAndOtherData[] | null
  >(null);

  const [reactionsArray, setReactionsArray] = useState<Reaction[] | null>(null);

  const [reactingUserInfoArray, setReactingUsersInfoArray] = useState<
    User[] | null
  >(null);

  const [userProfilePhotoArray, setUserProfilePhotoArray] = useState<
    PostFile[] | null
  >(null);

  const [commentingUserArray, setCommentingUserArray] = useState<
    UserInfoAndOtherData[] | null
  >(null);

  const [likingUsersArray, setLikingUsersArray] = useState<
    UserInfoAndOtherData[] | null
  >(null);

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
    if (
      clearLocalState &&
      (reactionsArray || commentingUserArray || likingUsersArray)
    ) {
      setReactionsArray([]);
      setCommentingUserArray([]);
      setLikingUsersArray([]);
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
    }
  }, [postId]);

  useEffect(() => {
    if (caption) {
      setCaptionInfoArray([
        {
          username: userName,
          name: '',
          profilePhotoFileString: userProfilePhotoFile,
          comment: caption,
          location: '',
          commentDate: createdAt,
        },
      ]);

      setEditPostDetails({ ...editPostDetails, editCaption: caption });
    }
  }, [caption]);

  useEffect(() => {
    if (location) {
      setEditPostDetails({ ...editPostDetails, editLocation: location });
    }
  }, [location]);

  useEffect(() => {
    if (postId) {
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [postId]);

  useEffect(() => {
    if (postReactionsArray && postReactionsArray.length) {
      for (let innerArray of postReactionsArray) {
        if (innerArray.length && innerArray[0].postId === postId) {
          setReactionsArray(innerArray);
        }
      }
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      for (let el of reactionsArray) {
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
      }
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post liked successfully!' &&
      postId
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: true,
        reactionId: postReactionConfirm.reactionId,
      });
      setLikingUsersArray([]);
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Like removed successfully!' &&
      postId
    ) {
      setAlreadyLikedPostAndReactionId({
        alreadyLikedPost: false,
        reactionId: '',
      });
      setLikingUsersArray([]);
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (
      postReactionConfirm &&
      postReactionConfirm.message === 'Post comment created successfully!' &&
      postId
    ) {
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [postReactionConfirm]);

  useEffect(() => {
    if (
      deleteReactionConfirm &&
      deleteReactionConfirm.message === 'Comment removed successfully!' &&
      postId
    ) {
      clearPostReactions();
      getPostReactionsStart({
        postId,
        reactionReqType: ReactionRequestType.singlePost,
      });
    }
  }, [deleteReactionConfirm]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      for (let el of reactionsArray) {
        getOtherUserStart({
          type: OtherUserType.POST_REACTOR,
          usernameOrId: el.reactingUserId,
        });
      }
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (postReactingUsers && postReactingUsers.length) {
      setReactingUsersInfoArray(postReactingUsers);
    }
  }, [postReactingUsers]);

  useEffect(() => {
    if (reactingUserInfoArray && reactingUserInfoArray.length) {
      for (let el of reactingUserInfoArray) {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
            fileRequestType: FileRequestType.singlePost,
          });
        }
      }
    }
  }, [reactingUserInfoArray]);

  useEffect(() => {
    if (reactorPhotoFileArray) {
      setUserProfilePhotoArray(reactorPhotoFileArray);
    }
  }, [reactorPhotoFileArray]);

  useEffect(() => {
    if (
      reactionsArray &&
      reactionsArray.length &&
      reactingUserInfoArray &&
      reactingUserInfoArray.length &&
      ((userProfilePhotoArray && userProfilePhotoArray.length) ||
        (!userProfilePhotoArray &&
          usersProfilePhotoConfirm === 'User photo added to reactor array!'))
    ) {
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      for (let reactionEl of reactionsArray) {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let comment = reactionEl.comment;
        let photoKey: string;
        let fileString: string;

        for (let infoEl of reactingUserInfoArray) {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        }

        if (userProfilePhotoArray) {
          for (let photoEl of userProfilePhotoArray) {
            if (photoEl.s3Key === photoKey!) {
              fileString = photoEl.fileString;
            }
          }
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
          });
        }
      }

      setCommentingUserArray(commentsArray);
      setLikingUsersArray(likesArray);
      setPostLikingUsersArray(likesArray);
    }
  }, [reactionsArray, reactingUserInfoArray, userProfilePhotoArray]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setComment(value);
  };

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (comment) {
      createPostReactionStart({
        reactingUserId: userId,
        postId: postId,
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
      postId: postId,
      likedPost: true,
      comment: '',
    });
  };

  const handleSubmitRemoveLike = () => {
    deleteReactionStart({
      reactionId: alreadyLikedPostAndReactionId.reactionId,
      isLikeRemoval: true,
    });
  };

  const handleRenderEditPostDetails = () => {
    if (isCurrentUserPost && !showPostEditForm) {
      // TODO: set show edit post form to true
      return (
        <span
          className='edit-post'
          onClick={() => console.log('setShowEditPostForm')}
        >
          Edit post details
        </span>
      );
    } else if (isCurrentUserPost && showPostEditForm) {
      return (
        <EditPostForm
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
                <span className='post-location'>{location}</span>
              </div>
              <div className='post-options'>
                <span className='ellipsis' onClick={onOptionsClick}>
                  ...
                </span>
              </div>
            </div>
          </div>
          <div className='caption-and-comments-container'>
            {captionInfoArray && captionInfoArray.length ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoArray={captionInfoArray}
                isCaption
                isCaptionOwner={isCurrentUserPost ? true : false}
              />
            ) : (
              handleRenderEditPostDetails()
            )}
            {commentingUserArray && commentingUserArray.length ? (
              <UserInfo
                styleType={StyleType.comment}
                userInfoArray={commentingUserArray}
              />
            ) : null}
          </div>
          {handleRenderLikeOrLikedButton()}
          {likingUsersArray && likingUsersArray.length ? (
            <Button className='likes-text' onClick={onPostLikingUsersClick}>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
