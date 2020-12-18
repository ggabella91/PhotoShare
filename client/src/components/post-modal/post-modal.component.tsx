import React from 'react';

import Modal from 'react-bootstrap/Modal';

import './post-modal.styles.scss';

interface Props {
  caption: string;
  createdAt: Date;
  location: string;
  show: boolean;
  onHide: () => void;
  fileString: string;
  userName: string;
}

const PostModal: React.FC<Props> = ({
  fileString,
  caption,
  location,
  createdAt,
  userName,
  ...props
}) => {
  const postDate = new Date(createdAt).toDateString();

  return (
    <Modal {...props} dialogClassName='post-modal' animation={false} centered>
      <Modal.Header className='post-modal-header' closeButton />
      <Modal.Body className='post-modal-body'>
        <img
          className='post-modal-image'
          src={`data:image/jpeg;base64,${fileString}`}
          alt='post-pic'
        />
        <div className='post-modal-details'>
          <span className='post-user'>{userName}</span>
          <span className='post-location'>{location}</span>
          <span className='post-caption'>{caption}</span>
          <span className='post-date'>{postDate}</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PostModal;
