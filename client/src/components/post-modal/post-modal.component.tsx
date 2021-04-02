import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import { Reaction, ReactionReq } from '../../redux/post/post.types';
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

import Modal from 'react-bootstrap/Modal';

import './post-modal.styles.scss';

interface PostModalProps {
  postId: string;
  caption: string;
  createdAt: Date;
  location: string;
  show: boolean;
  onHide: () => void;
  fileString: string;
  userName: string;
  onOptionsClick: () => void;
  userProfilePhotoFile: string;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  fileString,
  caption,
  location,
  createdAt,
  userName,
  onOptionsClick,
  userProfilePhotoFile,
  ...props
}) => {
  const postDate = new Date(createdAt).toDateString();

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
          <span className='post-date'>{postDate}</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

interface LinkStateProps {}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
