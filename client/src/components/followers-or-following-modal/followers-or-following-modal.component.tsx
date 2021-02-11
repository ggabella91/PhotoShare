import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';

import './followers-or-following-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface Props {
  userId: string;
  show: boolean;
  onHide: () => void;
  isFollowersModal: boolean;
}

const FollowersOrFollowingModal: React.FC<Props> = ({
  userId,
  isFollowersModal,
  onHide,
  ...props
}) => {
  // Need to fetch info and photos of followers or users-following and map array of divs to display this

  return (
    <Modal
      {...props}
      dialogClassName='followers-following-modal'
      animation={false}
      onHide={onHide}
      centered
    >
      <Modal.Header className='followers-following-modal-header' closeButton>
        {isFollowersModal ? 'Followers' : 'Following'}
      </Modal.Header>
      <Modal.Body className='followers-following-modal-body'>
        <div className='follower-or-following-user'></div>
      </Modal.Body>
    </Modal>
  );
};

interface LinkStateProps {}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowersOrFollowingModal);
