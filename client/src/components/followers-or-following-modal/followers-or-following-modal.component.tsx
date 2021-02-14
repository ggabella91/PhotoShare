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
import {
  selectUsersProfilePhotoFileArray,
  selectUsersProfilePhotoConfirm,
} from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import { Follower } from '../../redux/follower/follower.types';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './followers-or-following-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface FollowersOrFollowingModalProps {
  users: Follower[] | null;
  show: boolean;
  onHide: () => void;
  isFollowersModal: boolean;
  followersOrFollowing: User[] | null;
  usersProfilePhotoArray: PostFile[] | null;
  getOtherUserStart: typeof getOtherUserStart;
  getPostFileStart: typeof getPostFileStart;
  usersProfilePhotoConfirm: string | null;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
}

const FollowersOrFollowingModal: React.FC<FollowersOrFollowingModalProps> = ({
  users,
  isFollowersModal,
  onHide,
  followersOrFollowing,
  usersProfilePhotoArray,
  usersProfilePhotoConfirm,
  getOtherUserStart,
  getPostFileStart,
  ...props
}) => {
  const [usersArray, setUsersArray] = useState<User[]>([]);
  const [userInfoAndPhotoArray, setUserInfoAndPhotoArray] = useState<
    UserInfoData[]
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
    if (
      followersOrFollowing &&
      users &&
      followersOrFollowing.length === users.length &&
      !usersProfilePhotoArray
    ) {
      for (let user of followersOrFollowing) {
        if (user.photo) {
          getPostFileStart({
            user: UserType.usersArray,
            s3Key: user.photo,
            bucket,
          });
        }
      }
    } else if (
      followersOrFollowing &&
      usersProfilePhotoArray &&
      usersProfilePhotoArray.length
    ) {
      const followerOrFollowing: UserInfoData[] = followersOrFollowing.map(
        (el: User) => {
          let photoFileString: string;

          for (let file of usersProfilePhotoArray) {
            if (el.photo === file.s3Key) {
              photoFileString = file.fileString;
            }
          }

          return {
            name: el.name,
            username: el.username,
            profilePhotoFileString: photoFileString!,
          };
        }
      );

      setUserInfoAndPhotoArray(followerOrFollowing);
    } else if (followersOrFollowing && usersProfilePhotoConfirm) {
      const followerOrFollowing: UserInfoData[] = followersOrFollowing.map(
        (el: User) => {
          return {
            name: el.name,
            username: el.username,
            profilePhotoFileString: '',
          };
        }
      );

      setUserInfoAndPhotoArray(followerOrFollowing);
    }
  }, [followersOrFollowing, usersProfilePhotoArray, usersProfilePhotoConfirm]);

  return (
    <Modal
      {...props}
      dialogClassName='followers-following-modal'
      animation={false}
      onHide={onHide}
      centered
    >
      <Modal.Header className='followers-following-modal-header' closeButton>
        <span className='header-text'>
          {isFollowersModal ? 'Followers' : 'Following'}
        </span>
      </Modal.Header>
      <Modal.Body className='followers-following-modal-body'>
        <UserInfo
          userInfoArray={userInfoAndPhotoArray}
          styleType={StyleType.MODAL}
        />
      </Modal.Body>
    </Modal>
  );
};

interface LinkStateProps {
  followersOrFollowing: User[] | null;
  usersProfilePhotoArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  followersOrFollowing: selectFollowersOrFollowing,
  usersProfilePhotoArray: selectUsersProfilePhotoFileArray,
  usersProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowersOrFollowingModal);
