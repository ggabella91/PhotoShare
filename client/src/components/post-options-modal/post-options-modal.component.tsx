import React from 'react';

import './post-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  onHide: () => void;
  archive: () => void;
}

const PostOptionsModal: React.FC<Props> = ({ archive, ...props }) => (
  <Modal {...props}>
    <Modal.Body className='options'>
      <span onClick={archive}>Archive</span>
      <span>Cancel</span>
    </Modal.Body>
  </Modal>
);

export default PostOptionsModal;
