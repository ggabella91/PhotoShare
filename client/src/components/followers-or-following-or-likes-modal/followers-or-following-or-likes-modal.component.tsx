import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { List } from 'immutable';

import {
  User,
  OtherUserType,
  OtherUserRequest,
} from '../../redux/user/user.types';
import {
  selectFollowersInfo,
  selectFollowingInfo,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  FileRequestType,
  PostFileReq,
  PostFile,
  UserType,
} from '../../redux/post/post.types';
import {
  selectFollowPhotoFileArray,
  selectUsersProfilePhotoConfirm,
} from '../../redux/post/post.selectors';
import {
  clearFollowPhotoFileArray,
  getPostFileStart,
} from '../../redux/post/post.actions';

import { Follower } from '../../redux/follower/follower.types';

import UserInfo, {
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

import './followers-or-following-or-likes-modal.styles.scss';
import Modal from 'react-bootstrap/Modal';

interface FollowersOrFollowingOrLikesModalProps {
  users: Follower[] | null;
  show: boolean;
  onHide: () => void;
  isFollowersModal: boolean;
  isPostLikingUsersModal?: boolean;
  postLikingUsersList?: List<UserInfoAndOtherData>;
  followers: User[] | null;
  following: User[] | null;
  followPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
  getOtherUserStart: typeof getOtherUserStart;
  getPostFileStart: typeof getPostFileStart;
  clearFollowPhotoFileArray: typeof clearFollowPhotoFileArray;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: string;
  comment: string;
}

export const FollowersOrFollowingOrLikesModal: React.FC<FollowersOrFollowingOrLikesModalProps> =
  ({
    users,
    isFollowersModal,
    isPostLikingUsersModal,
    postLikingUsersList,
    onHide,
    followers,
    following,
    followPhotoFileArray,
    usersProfilePhotoConfirm,
    getOtherUserStart,
    getPostFileStart,
    clearFollowPhotoFileArray,
    ...props
  }) => {
    const [userInfoAndPhotoList, setUserInfoAndPhotoList] = useState<
      List<UserInfoData>
    >(List());

    let usersLoaded = useRef(false);

    let bucket: string;

    if (process.env.NODE_ENV === 'production') {
      bucket = 'photo-share-app-profile-photos';
    } else {
      bucket = 'photo-share-app-profile-photos-dev';
    }

    useEffect(() => {
      if (users && users.length && !usersLoaded.current) {
        usersLoaded.current = true;
        clearFollowPhotoFileArray();

        if (isFollowersModal) {
          users.forEach((user) => {
            getOtherUserStart({
              type: OtherUserType.FOLLOWERS,
              usernameOrId: user.followerId,
            });
          });
        } else {
          users.forEach((user) => {
            getOtherUserStart({
              type: OtherUserType.FOLLOWING,
              usernameOrId: user.userId,
            });
          });
        }
      }
    }, [users]);

    useEffect(() => {
      if (!isPostLikingUsersModal) {
        if (isFollowersModal && followers) {
          handleRenderFollowersOrFollowingInfoArray(followers);
        } else if (!isFollowersModal && following) {
          handleRenderFollowersOrFollowingInfoArray(following);
        }
      }
    }, [followers, following, followPhotoFileArray, usersProfilePhotoConfirm]);

    const handleRenderFollowersOrFollowingInfoArray = (
      followersOrFollowing: User[]
    ) => {
      let followersOrFollowingList: List<User>;

      if (followersOrFollowing.length) {
        followersOrFollowingList = List(followersOrFollowing);
      } else {
        followersOrFollowingList = List();
      }

      if (
        users &&
        followersOrFollowingList.size === users.length &&
        !followPhotoFileArray
      ) {
        followersOrFollowing.forEach((user) => {
          if (user.photo) {
            getPostFileStart({
              user: UserType.followArray,
              s3Key: user.photo,
              bucket,
              fileRequestType: FileRequestType.singlePost,
            });
          }
        });
      } else if (followPhotoFileArray && followPhotoFileArray.length) {
        const followerOrFollowing: List<UserInfoData> =
          followersOrFollowingList.map((el: User) => {
            let photoFileString: string;

            followPhotoFileArray.forEach((file) => {
              if (el.photo === file.s3Key) {
                photoFileString = file.fileString;
              }
            });

            return {
              name: el.name,
              username: el.username,
              profilePhotoFileString: photoFileString!,
              photo: el.photo || '',
              location: '',
              comment: '',
            };
          });

        setUserInfoAndPhotoList(followerOrFollowing);
      } else if (!followPhotoFileArray && usersProfilePhotoConfirm) {
        const followerOrFollowing: List<UserInfoData> =
          followersOrFollowingList.map((el: User) => {
            return {
              name: el.name,
              username: el.username,
              profilePhotoFileString: '',
              photo: el.photo || '',
              location: '',
              comment: '',
            };
          });

        setUserInfoAndPhotoList(followerOrFollowing);
      }
    };

    useEffect(() => {
      if (isPostLikingUsersModal && postLikingUsersList) {
        let postLikerArray: List<UserInfoData>;

        postLikerArray = postLikingUsersList.map((el) => {
          return {
            profilePhotoFileString: el.profilePhotoFileString,
            username: el.username,
            name: el.name,
            photo: '',
            location: '',
            comment: '',
          };
        });

        setUserInfoAndPhotoList(postLikerArray);
      }
    }, [postLikingUsersList]);

    return (
      <Modal
        {...props}
        dialogClassName='followers-following-modal'
        animation={false}
        onHide={onHide}
        centered
        data-testid='followers-following-or-likes-modal'
      >
        <Modal.Header className='followers-following-modal-header' closeButton>
          <span className='header-text'>
            {isPostLikingUsersModal
              ? 'Likes'
              : isFollowersModal
              ? 'Followers'
              : 'Following'}
          </span>
        </Modal.Header>
        <Modal.Body className='followers-following-modal-body'>
          <UserInfo
            userInfoList={userInfoAndPhotoList}
            styleType={StyleType.modal}
          />
        </Modal.Body>
      </Modal>
    );
  };

interface LinkStateProps {
  followers: User[] | null;
  following: User[] | null;
  followPhotoFileArray: PostFile[] | null;
  usersProfilePhotoConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  followers: selectFollowersInfo,
  following: selectFollowingInfo,
  followPhotoFileArray: selectFollowPhotoFileArray,
  usersProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (otherUserReq: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserReq)),
  getPostFileStart: (postFileReq: PostFileReq) =>
    dispatch(getPostFileStart(postFileReq)),
  clearFollowPhotoFileArray: () => dispatch(clearFollowPhotoFileArray()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowersOrFollowingOrLikesModal);
