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
  onOptionsClick: () => void;
  userProfilePhotoFile: string;
}

const PostModal: React.FC<Props> = ({
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
      <div className='column-alignment'>
        <div className='large-image-header-body'>
          <img
            className='post-modal-image-large'
            src={`data:image/jpeg;base64,${fileString}`}
            alt='user'
          />
          <div>
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostModal;
