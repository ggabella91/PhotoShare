import React from 'react';

import './post-options-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  onHide: () => void;
  archive: () => void;
}

const PostOptionsModal: React.FC<Props> = ({ archive, ...props }) => (
  <Modal
    {...props}
    dialogClassName='post-options-modal'
    animation={false}
    centered
  >
    <Modal.Body className='post-options-modal-body'>
      <span onClick={archive}>Archive</span>
      <span>Cancel</span>
    </Modal.Body>
  </Modal>
);

export default PostOptionsModal;
