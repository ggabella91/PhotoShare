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
    animation={false}
    centered
  >
    <Modal.Body className='post-options-modal-body'>
      <div className='archive'>
        <span onClick={archive}>Archive</span>
      </div>
      <div className='cancel'>
        <span onClick={onHide}>Cancel</span>
      </div>
    </Modal.Body>
  </Modal>
);

export default PostOptionsModal;
