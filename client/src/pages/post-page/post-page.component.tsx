import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'immutable';
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

interface PostPageProps {}

const PostPage: React.FC<PostPageProps> = ({}) => {
  const userState = useSelector((state: AppState) => state.user);
  const postState = useSelector((state: AppState) => state.post);
  const followerState = useSelector((state: AppState) => state.follower);

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
