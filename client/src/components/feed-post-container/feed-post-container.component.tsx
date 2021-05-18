import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import { Reaction, ReactionReq, PostError } from '../../redux/post/post.types';
import {
  selectPostReactionsArray,
  selectPostReactionConfirm,
  selectPostReactionError,
  selectGetPostReactionsConfirm,
  selectGetPostReactionsError,
} from '../../redux/post/post.selectors';
import {
  createPostReactionStart,
  getPostReactionsStart,
} from '../../redux/post/post.actions';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {
  userInfo: UserInfoData;
  fileString: string;
  caption?: string;
  date: string;
  postReactionsArray: Reaction[][];
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
  createPostReactionStart: typeof createPostReactionStart;
  getPostReactionsStart: typeof getPostReactionsStart;
  ref?: (node: any) => void;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  location: string;
  name: string;
  comment: string;
}

export const FeedPostContainer: React.FC<FeedPostContainerProps> = ({
  userInfo,
  fileString,
  caption,
  date,
}) => {
  return (
    <div className='feed-post-container'>
      <div className='profile-and-options'>
        <UserInfo styleType={StyleType.feed} userInfoArray={[userInfo]} />
      </div>
      <img
        className='feed-post-photo'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='user'
      />
      <div className='caption-and-reactions'>
        <div className='caption'>
          <span className='username'>{userInfo.username}</span>{' '}
          {caption ? caption : ''}
        </div>
        <span className='date'>{date}</span>
      </div>
    </div>
  );
};

interface LinkStateProps {
  postReactionsArray: Reaction[][];
  postReactionConfirm: string | null;
  postReactionError: PostError | null;
  getPostReactionsConfirm: string | null;
  getPostReactionsError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  postReactionsArray: selectPostReactionsArray,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedPostContainer);
