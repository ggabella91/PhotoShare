import React from 'react';

import './unfollow-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  show: boolean;
  onHide: () => void;
  unfollow: () => void;
  username: string;
  profilePhoto: string | null;
}

const UnfollowModal: React.FC<Props> = ({
  unfollow,
  username,
  profilePhoto,
  onHide,
  ...props
}) => (
  <Modal
    {...props}
    dialogClassName='unfollow-modal'
    animation={false}
    onHide={onHide}
    centered
  >
    <Modal.Header className='unfollow-modal-header'>
      <div className='avatar'>
        {profilePhoto ? (
          <img
            className='profile-photo'
            src={`data:image/jpeg;base64,${profilePhoto}`}
            alt='profile-pic'
          />
        ) : null}
        {!profilePhoto ? (
          <div className='user-bio-photo-placeholder'>
            <span className='user-bio-photo-placeholder-text'>No photo</span>
          </div>
        ) : null}
      </div>
      <div className='unfollow-verify'>
        <span className='verify-text'>Unfollow @{username}?</span>
      </div>
    </Modal.Header>
    <Modal.Body className='unfollow-modal-body'>
      <div className='unfollow' onClick={unfollow}>
        <span className='unfollow-confirm'>Unfollow</span>
      </div>
      <div className='cancel-unfollow' onClick={onHide}>
        <span>Cancel</span>
      </div>
    </Modal.Body>
  </Modal>
);

export default UnfollowModal;
