import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
  SinglePostDataReq,
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
  getSinglePostDataStart,
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  getUserPhotoForReactorArraySuccess,
  deleteReactionStart,
  clearPostReactions,
  setPostLikingUsersArray,
  setShowPostEditForm,
  savePostModalDataToCache,
  removePostModalDataFromCache,
  clearPostState,
} from '../../redux/post/post.actions';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../../components/user-info/user-info.component';

import Modal from 'react-bootstrap/Modal';
import Button from '../../components/button/button.component';
import { ExpandableFormInput } from '../../components/form-input/form-input.component';
import EditPostForm from '../../components/edit-post-form/edit-post-form.component';

import {
  compareUserOrPostOrReactionLists,
  compareUserInfoAndDataObjLists,
} from '../../pages/feed-page/feed-page.utils';

interface Params {
  postId: string;
}

export interface ImmutableMap<T> extends Map<string, any> {
  get<K extends keyof T>(name: K): T[K];
}

export interface AlreadyLikedAndReactionId {
  alreadyLikedPost: boolean;
  reactionId: string;
}

interface PostPageProps {}

const PostPage: React.FC<PostPageProps> = ({}) => {
  const userState = useSelector((state: AppState) => state.user);
  const postState = useSelector((state: AppState) => state.post);
  const followerState = useSelector((state: AppState) => state.follower);

  const dispatch = useDispatch();

  const { postId } = useParams<Params>();

  console.log('postId: ', postId);

  const { currentUser, otherUser } = userState;

  const { getSinglePostDataConfirm } = postState;

  const [postData, setPostData] = useState<Post | null>(null);

  const [currentUserPost, setCurrentUserPost] = useState<boolean>(false);

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

  let bucket: string;

  process.env.NODE_ENV === 'production'
    ? (bucket = 'photo-share-app-profile-photos')
    : (bucket = 'photo-share-app-profile-photos-dev');

  useEffect(
    // Clear post state when cleaning up before component
    // leaves the screen
    () => () => {
      clearPostState();
    },
    []
  );

  useEffect(() => {
    let currentUserMap;

    if (currentUser) {
      currentUserMap = Map(currentUser);
    } else {
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(getSinglePostDataStart({ postId }));
  }, [postId]);

  useEffect(() => {
    if (getSinglePostDataConfirm) {
      setPostData(getSinglePostDataConfirm);

      const { userId } = getSinglePostDataConfirm;

      dispatch(
        getOtherUserStart({ type: OtherUserType.OTHER, usernameOrId: userId })
      );
    }
  }, [getSinglePostDataConfirm]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      dispatch(
        getPostFileStart({
          user: UserType.other,
          fileRequestType: FileRequestType.singlePost,
          s3Key: otherUser.photo,
          bucket,
        })
      );
    }
  }, [otherUser]);

  useEffect(() => {
    if (postData) {
      handleSetIsCurrentUserPost(postData);
    }
  }, [postData]);

  const handleSetIsCurrentUserPost = (postData: Post) => {
    if (currentUser) {
      if (postData.userId === currentUser.id) {
        setCurrentUserPost(true);
      } else {
        setCurrentUserPost(false);
      }
    }
  };

  return (
    <div className='post-page'>
      <div className='post-container'>
        <div className='post-image-container'>
          {/*
          <img
            className='post-image'
            src={`data:image/jpeg;base64,${fileString}`}
            alt='post-pic'
          />
        </div>
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
        */}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
