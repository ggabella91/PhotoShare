import React from 'react';

import './post-or-comment-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface OptionsProps {
  show: boolean;
  onHide: () => void;
  archive: () => void;
  isCurrentUserPostOrComment: boolean;
  postOptionsModal: boolean;
  isInPostPage?: boolean;
  onGoToPostClick?: () => void;
}

const PostOrCommentOptionsModal: React.FC<OptionsProps> = ({
  archive,
  onHide,
  isCurrentUserPostOrComment,
  postOptionsModal,
  isInPostPage,
  onGoToPostClick,
  ...props
}) => {
  let shiftRight: boolean;
  process.env.NODE_ENV === 'development'
    ? (shiftRight = true)
    : (shiftRight = false);

  return (
    <Modal
      {...props}
      dialogClassName={`${
        shiftRight ? 'shift-right' : ''
      } : post-options-modal`}
      animation={false}
      onHide={onHide}
      centered
    >
      <Modal.Body className='post-options-modal-body'>
        {postOptionsModal && !isInPostPage ? (
          <div
            className='go-to-post'
            onClick={onGoToPostClick}
            data-testid='go-to-post-button'
          >
            <span>Go to post</span>
          </div>
        ) : null}
        {isCurrentUserPostOrComment ? (
          <div
            className='archive'
            onClick={archive}
            data-testid='archive-button'
          >
            <span>Archive</span>
          </div>
        ) : null}
        <div className='cancel' onClick={onHide} data-testid='cancel-button'>
          <span>Cancel</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PostOrCommentOptionsModal;
