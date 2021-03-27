import React from 'react';

import './post-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  onHide: () => void;
  archive: () => void;
  isCurrentUserPost: boolean;
}

const PostOptionsModal: React.FC<Props> = ({
  archive,
  onHide,
  isCurrentUserPost,
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
      {isCurrentUserPost ? (
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

export default PostOptionsModal;
