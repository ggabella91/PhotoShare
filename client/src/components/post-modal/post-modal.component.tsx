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
  PostError,
  PostFileReq,
  PostFile,
  UserType,
} from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectReactorPhotoFileArray,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import Modal from 'react-bootstrap/Modal';
import Button from '../button/button.component';

import './post-modal.styles.scss';
import { ExpandableFormInput } from '../form-input/form-input.component';

interface PostModalProps {
  currentUser: User | null;
  postId: string;
  caption: string;
  createdAt: Date;
  location: string;
  show: boolean;
  onHide: () => void;
  fileString: string;
  userName: string;
  userId: string;
  onOptionsClick: () => void;
  userProfilePhotoFile: string;
  postReactionsArray: Reaction[][];
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  postReactingUsers: User[] | null;
  reactorPhotoFileArray: PostFile[] | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  getPostFileStart: typeof getPostFileStart;
  getOtherUserStart: typeof getOtherUserStart;
}

export const PostModal: React.FC<PostModalProps> = ({
  currentUser,
  postId,
  fileString,
  caption,
  location,
  createdAt,
  userName,
  userId,
  onOptionsClick,
  userProfilePhotoFile,
  postReactionsArray,
  postReactingUsers,
  reactorPhotoFileArray,
  createPostReactionStart,
  getPostReactionsStart,
  getOtherUserStart,
  getPostFileStart,
  ...props
}) => {
  const [comment, setComment] = useState('');

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

  const [postLikingUserArray, setPostLikingUserArray] = useState<
    UserInfoAndOtherData[] | null
  >(null);

  /******************************************************************
    TODO
    
    1. Fetch usernames corresponding to each user that reacted on post - DONE
    2. Organize and save comments data array with usernames, photos, and comments - DONE?
    3. Organize and save likes data array with usernames and photos - DONE?

    *****************************************************************/

  const [alreadyLikedPost, setAlreadyLikedPost] = useState(false);

  const postDate = new Date(createdAt).toDateString();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (postId) {
      getPostReactionsStart(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (postReactionsArray.length) {
      console.log('Setting reactionsArray');
      for (let innerArray of postReactionsArray) {
        if (innerArray.length && innerArray[0].postId === postId) {
          console.log('postId matches');
          setReactionsArray(innerArray);
        }
      }
    }
  }, [postReactionsArray]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      console.log('reactionsArray is set:', reactionsArray);
      for (let el of reactionsArray) {
        if (
          currentUser &&
          el.reactingUserId === currentUser.id &&
          el.likedPost
        ) {
          setAlreadyLikedPost(true);
        }
      }
    }
  }, [reactionsArray]);

  useEffect(() => {
    if (reactionsArray && reactionsArray.length) {
      console.log(
        'reactionsArray is set in getOtherUserStart useEffect hook:',
        reactionsArray
      );
      for (let el of reactionsArray) {
        console.log(el);
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
      console.log('Fetched reacting users successfully');
      for (let el of reactingUserInfoArray) {
        if (el.photo) {
          getPostFileStart({
            s3Key: el.photo,
            bucket,
            user: UserType.postReactorsArray,
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
      userProfilePhotoArray &&
      userProfilePhotoArray.length
    ) {
      console.log('Got to comment and like array creation');
      let commentsArray: UserInfoAndOtherData[] = [];
      let likesArray: UserInfoAndOtherData[] = [];

      for (let reactionEl of reactionsArray) {
        const userId = reactionEl.reactingUserId;
        let username: string;
        let name: string;
        let photoKey: string;
        let fileString: string;

        for (let infoEl of reactingUserInfoArray) {
          if (infoEl.id === userId) {
            username = infoEl.username;
            name = infoEl.name;
            photoKey = infoEl.photo || '';
          }
        }

        for (let photoEl of userProfilePhotoArray) {
          if (photoEl.s3Key === photoKey!) {
            fileString = photoEl.fileString;
          }
        }

        if (!photoKey!) {
          fileString = '';
        }

        if (reactionEl.likedPost) {
          likesArray.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment: '',
            location: '',
          });
        } else {
          commentsArray.push({
            username: username!,
            name: name!,
            profilePhotoFileString: fileString!,
            comment,
            location: '',
          });
        }
      }

      setCommentingUserArray(commentsArray);
      setPostLikingUserArray(likesArray);
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

  const handleSubmitLike = () => {
    createPostReactionStart({
      reactingUserId: userId,
      postId: postId,
      likedPost: true,
      comment: '',
    });
  };

  useEffect(() => {
    if (commentingUserArray && commentingUserArray.length) {
      console.log(commentingUserArray);
    }
  }, [commentingUserArray]);

  return (
    <Modal {...props} dialogClassName='post-modal' animation={false} centered>
      <div className='large-image-adjustments'>
        <img
          className='post-modal-image-large'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='user'
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
          <span className='post-caption'>{caption}</span>
          {commentingUserArray && commentingUserArray.length ? (
            <UserInfo
              styleType={StyleType.comment}
              userInfoArray={commentingUserArray}
            />
          ) : null}
          <Button className='like-text-button' onClick={handleSubmitLike}>
            <span>{alreadyLikedPost ? 'Liked' : 'Like'}</span>
          </Button>
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
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postReactionsArray: selectPostReactionsArray,
  postReactingUsers: selectPostReactingUsers,
  reactorPhotoFileArray: selectReactorPhotoFileArray,
  postReactionConfirm: selectPostReactionConfirm,
  postReactionError: selectPostReactionError,
  getPostReactionsConfirm: selectGetPostReactionsConfirm,
  getPostReactionsError: selectGetPostReactionsError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostReactionStart: (reactionReq: ReactionReq) =>
    dispatch(createPostReactionStart(reactionReq)),
  getPostReactionsStart: (postId: string) =>
    dispatch(getPostReactionsStart(postId)),
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
