import React from 'react';

import './post-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  onHide: () => void;
  archive: () => void;
}

const PostOptionsModal: React.FC<Props> = ({ archive, onHide, ...props }) => (
  <Modal
    {...props}
    dialogClassName='post-options-modal'
    backdropClassName='post-options-backdrop'
    animation={false}
    backdrop={true}
    centered
  >
    <Modal.Body className='post-options-modal-body'>
      <div className='archive' onClick={archive}>
        <span>Archive</span>
      </div>
      <div className='cancel' onClick={onHide}>
        <span>Cancel</span>
      </div>
    </Modal.Body>
  </Modal>
);

export default PostOptionsModal;
