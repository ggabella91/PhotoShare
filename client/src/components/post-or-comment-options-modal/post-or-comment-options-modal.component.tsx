import React from 'react';

import './post-or-comment-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  onHide: () => void;
  archive: () => void;
  isCurrentUserPostOrComment: boolean;
}

const PostOrCommentOptionsModal: React.FC<Props> = ({
  archive,
  onHide,
  isCurrentUserPostOrComment,
  ...props
}) => (
  <Modal
    {...props}
    dialogClassName='post-options-modal'
    animation={false}
    onHide={onHide}
    centered
  >
    <Modal.Body className='post-options-modal-body'>
      {isCurrentUserPostOrComment ? (
        <div className='archive' onClick={archive}>
          <span>Archive</span>
        </div>
      ) : null}
      <div className='cancel' onClick={onHide}>
        <span>Cancel</span>
      </div>
    </Modal.Body>
  </Modal>
);

export default PostOrCommentOptionsModal;
