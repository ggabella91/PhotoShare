import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { User, OtherUserType } from '../../redux/user/user.types';
import {
  selectFollowersInfo,
  selectFollowingInfo,
} from '../../redux/user/user.selectors';
import {
  clearFollowersAndFollowing,
  getOtherUserStart,
} from '../../redux/user/user.actions';

import {
  FileRequestType,
  UserType,
  Location,
} from '../../redux/post/post.types';
import { selectFollowPhotoFileArray } from '../../redux/post/post.selectors';
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
import {
  selectCurrentUserUsersFollowing,
  selectFollowers,
  selectIsFollowersModal,
  selectOtherUserUsersFollowing,
} from '../../redux/follower/follower.selectors';
import { clearFollowState } from '../../redux/follower/follower.actions';

interface FollowersOrFollowingOrLikesModalProps {
  currentOrOtherUser: string;
  show: boolean;
  onHide: () => void;
  isPostLikingUsersModal?: boolean;
  postLikingUsersArray?: UserInfoAndOtherData[];
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: Location;
  comment: string;
}

export const FollowersOrFollowingOrLikesModal: React.FC<
  FollowersOrFollowingOrLikesModalProps
> = ({
  currentOrOtherUser,
  isPostLikingUsersModal,
  postLikingUsersArray,
  onHide,
  ...props
}) => {
  const [userInfoAndPhotoArray, setUserInfoAndPhotoArray] = useState<
    UserInfoData[]
  >([]);
  const [noProfilePhotosToFetch, setNoProfilePhotosToFetch] = useState(false);

  const isFollowersModal = useSelector(selectIsFollowersModal);
  const followers = useSelector(selectFollowers) || [];
  const currentUserUsersFollowing = useSelector(
    selectCurrentUserUsersFollowing
  );
  const otherUserUsersFollowing = useSelector(selectOtherUserUsersFollowing);
  const usersFollowing =
    currentOrOtherUser === 'current'
      ? currentUserUsersFollowing || []
      : otherUserUsersFollowing || [];
  const followersInfo = useSelector(selectFollowersInfo);
  const followingInfo = useSelector(selectFollowingInfo);
  const followPhotoFileArray = useSelector(selectFollowPhotoFileArray);
  const location = useLocation();
  const dispatch = useDispatch();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    dispatch(clearFollowState());
    dispatch(clearFollowersAndFollowing());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    dispatch(clearFollowPhotoFileArray());

    if (isFollowersModal) {
      followers?.forEach((user) => {
        dispatch(
          getOtherUserStart({
            type: OtherUserType.FOLLOWERS,
            usernameOrId: user.followerId,
          })
        );
      });
    } else {
      usersFollowing?.forEach((user) => {
        dispatch(
          getOtherUserStart({
            type: OtherUserType.FOLLOWING,
            usernameOrId: user.userId,
          })
        );
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followers, usersFollowing, isFollowersModal]);

  useEffect(() => {
    if (!isPostLikingUsersModal) {
      if (isFollowersModal && followersInfo) {
        handleRenderFollowersOrFollowingInfoArray(followersInfo, followers);
      } else if (!isFollowersModal && followingInfo) {
        handleRenderFollowersOrFollowingInfoArray(
          followingInfo,
          usersFollowing
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    followersInfo,
    followingInfo,
    followPhotoFileArray,
    noProfilePhotosToFetch,
    isFollowersModal,
    isPostLikingUsersModal,
  ]);

  const handleRenderFollowersOrFollowingInfoArray = (
    followersOrFollowing: User[],
    users: Follower[]
  ) => {
    if (
      usersFollowing &&
      followersOrFollowing.length === users.length &&
      !followPhotoFileArray &&
      !noProfilePhotosToFetch
    ) {
      let fetchCount = 0;

      followersOrFollowing.forEach((user) => {
        if (user.photo) {
          fetchCount++;
          dispatch(
            getPostFileStart({
              user: UserType.followArray,
              s3Key: user.photo,
              bucket,
              fileRequestType: FileRequestType.singlePost,
            })
          );
        }
      });

      if (fetchCount === 0) {
        setNoProfilePhotosToFetch(true);
      }
    } else if (followPhotoFileArray?.length) {
      const followerOrFollowing: UserInfoData[] = followersOrFollowing.map(
        (el: User) => {
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
            location: {} as Location,
            comment: '',
          };
        }
      );

      setUserInfoAndPhotoArray(followerOrFollowing);
    } else if (!followPhotoFileArray && noProfilePhotosToFetch) {
      const followerOrFollowing: UserInfoData[] = followersOrFollowing.map(
        (el: User) => {
          return {
            name: el.name,
            username: el.username,
            profilePhotoFileString: '',
            photo: el.photo || '',
            location: {} as Location,
            comment: '',
          };
        }
      );

      setUserInfoAndPhotoArray(followerOrFollowing);
    }
  };

  useEffect(() => {
    if (isPostLikingUsersModal && postLikingUsersArray) {
      let postLikerArray: UserInfoData[];

      postLikerArray = postLikingUsersArray.map((el) => {
        return {
          profilePhotoFileString: el.profilePhotoFileString,
          username: el.username,
          name: el.name,
          photo: '',
          location: {} as Location,
          comment: '',
        };
      });

      setUserInfoAndPhotoArray(postLikerArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postLikingUsersArray]);

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
          userInfoArray={userInfoAndPhotoArray}
          styleType={StyleType.modal}
        />
      </Modal.Body>
    </Modal>
  );
};

export default FollowersOrFollowingOrLikesModal;
