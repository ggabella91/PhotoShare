import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import { selectFollowersOrFollowing } from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import { PostFileReq, PostFile, UserType } from '../../redux/post/post.types';
import { selectUsersProfilePhotoFileArray } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import { Follower } from '../../redux/follower/follower.types';

import './followers-or-following-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface FollowersOrFollowingModalProps {
  users: Follower[];
  show: boolean;
  onHide: () => void;
  isFollowersModal: boolean;
  followersOrFollowing: User[] | null;
  usersProfilePhotoArray: PostFile[] | null;
  getOtherUserStart: typeof getOtherUserStart;
  getPostFileStart: typeof getPostFileStart;
}

export interface FollowerOrFollowingData {
  profilePhotoFileString: string;
  username: string;
  name: string;
}

const FollowersOrFollowingModal: React.FC<FollowersOrFollowingModalProps> = ({
  users,
  isFollowersModal,
  onHide,
  followersOrFollowing,
  getOtherUserStart,
  getPostFileStart,
  ...props
}) => {
  const [usersArray, setUsersArray] = useState<User[]>([]);
  const [userInfoAndPhotoArray, setUserInfoAndPhotoArray] = useState<
    FollowerOrFollowingData[]
  >([]);

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (users) {
      if (isFollowersModal) {
        for (let user of users) {
          getOtherUserStart({
            type: OtherUserType.FOLLOWERS_OR_FOLLOWING,
            usernameOrId: user.followerId,
          });
        }
      } else {
        for (let user of users) {
          getOtherUserStart({
            type: OtherUserType.FOLLOWERS_OR_FOLLOWING,
            usernameOrId: user.userId,
          });
        }
      }
    }
  }, [users]);

  useEffect(() => {
    if (followersOrFollowing && followersOrFollowing.length === users.length) {
      for (let user of followersOrFollowing) {
        if (user.photo) {
          getPostFileStart({
            user: UserType.usersArray,
            s3Key: user.photo,
            bucket,
          });
        }
      }
    }
  }, [followersOrFollowing, followersOrFollowing?.length]);

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

interface LinkStateProps {
  followersOrFollowing: User[] | null;
  usersProfilePhotoArray: PostFile[] | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  followersOrFollowing: selectFollowersOrFollowing,
  usersProfilePhotoArray: selectUsersProfilePhotoFileArray,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowersOrFollowingModal);
