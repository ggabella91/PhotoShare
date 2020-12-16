import React from 'react';

import Modal from 'react-bootstrap/Modal';

import './post-modal.styles.scss';

interface Props {
  caption: string;
  createdAt: Date;
  // location: string;
  show: boolean;
  onHide: () => void;
  fileString: string;
}

const PostModal: React.FC<Props> = ({ fileString, ...props }) => (
  <Modal {...props} dialogClassName='custom-modal' centered>
    <Modal.Body className='post-modal-body'>
      <img
        className='post-modal-image'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='post-pic'
      />
    </Modal.Body>
  </Modal>
);

export default PostModal;
