import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import {
  User,
  OtherUserRequest,
  OtherUserType,
} from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {
  getOtherUserStart,
  clearFollowersAndFollowing,
} from '../../redux/user/user.actions';

import {
  Post,
  PostFileReq,
  ArchivePostReq,
  PostFile,
  PostError,
  UserType,
} from '../../redux/post/post.types';
import {
  selectProfilePhotoKey,
  selectProfilePhotoFile,
  selectPostData,
  selectPostFiles,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
  selectArchivePostConfirm,
  selectArchivePostError,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearArchivePostStatuses,
  clearUsersPhotoFileArray,
  clearPostState,
} from '../../redux/post/post.actions';

import {
  Follower,
  FollowError,
  WhoseUsersFollowing,
  UsersFollowingRequest,
} from '../../redux/follower/follower.types';
import {
  selectFollowers,
  selectCurrentUserUsersFollowing,
  selectGetUsersFollowingConfirm,
} from '../../redux/follower/follower.selectors';
import {
  getFollowersStart,
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOptionsModal from '../../components/post-options-modal/post-options-modal.component';
import FollowersOrFollowingModal from '../../components/followers-or-following-modal/followers-or-following-modal.component';

import './profile-page.styles.scss';

interface MyProfilePageProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
  clearArchivePostStatuses: typeof clearArchivePostStatuses;
  clearPostState: typeof clearPostState;
  clearUsersPhotoFileArray: typeof clearUsersPhotoFileArray;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
  getOtherUserStart: typeof getOtherUserStart;
  clearFollowersAndFollowing: typeof clearFollowersAndFollowing;
  clearFollowState: typeof clearFollowState;
}

interface PostModalProps {
  id: string;
  s3Key: string;
  caption: string;
  location: string;
  createdAt: Date | null;
  fileString: string;
}

interface FollowersAndUsersFollowing {
  followersArray: Follower[] | null;
  usersFollowingArray: Follower[] | null;
}

export const MyProfilePage: React.FC<MyProfilePageProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  postData,
  postFiles,
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  archivePostConfirm,
  clearArchivePostStatuses,
  clearUsersPhotoFileArray,
  clearPostState,
  followers,
  currentUserUsersFollowing,
  getFollowersStart,
  getUsersFollowingStart,
  getUsersFollowingConfirm,
  getOtherUserStart,
  clearFollowersAndFollowing,
  clearFollowState,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [followersArray, setFollowersArray] = useState<Follower[] | null>(null);
  const [usersFollowingArray, setUsersFollowingArray] = useState<
    Follower[] | null
  >(null);

  const [isFollowing, setIsFollowing] = useState(false);

  const [postDataArray, setPostDataArray] = useState<Post[]>([]);
  const [postFileArray, setPostFileArray] = useState<PostFile[]>([]);

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState<PostModalProps>({
    id: '',
    s3Key: '',
    caption: '',
    location: '',
    createdAt: null,
    fileString: '',
  });

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  const [isFollowersModal, setIsFollowersModal] = useState(true);

  const [
    followersOrFollowingModalShow,
    setFollowersOrFollowingModalShow,
  ] = useState(false);

  let postsBucket: string, profileBucket: string;

  if (process.env.NODE_ENV === 'production') {
    postsBucket = 'photo-share-app';
    profileBucket = 'photo-share-app-profile-photos';
  } else {
    postsBucket = 'photo-share-app-dev';
    profileBucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (currentUser && !user.name) {
      clearPostState();
      clearFollowState();
      clearFollowersAndFollowing();

      setUser({
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio || '',
      });
      getPostDataStart(currentUser.id);
      getFollowersStart(currentUser.id);
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (followers) {
      setFollowersArray(followers);
    }

    if (currentUserUsersFollowing) {
      setUsersFollowingArray(currentUserUsersFollowing);
    }
  }, [followers, currentUserUsersFollowing]);

  useEffect(() => {
    if (profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket: profileBucket,
        user: UserType.self,
      });
    } else if (!profilePhotoFile && currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket: profileBucket,
        user: UserType.self,
      });
    }
  }, [profilePhotoKey]);

  useEffect(() => {
    if (profilePhotoFile) {
      setProfilePhoto(profilePhotoFile);
    }
  }, [profilePhotoFile]);

  useEffect(() => {
    if (postData && postData.length) {
      setPostDataArray(postData);
    }
  }, [postData]);

  useEffect(() => {
    if (postData && postDataArray.length === postData.length) {
      for (let post of postDataArray) {
        getPostFileStart({
          s3Key: post.s3Key,
          bucket: postsBucket,
          user: UserType.self,
        });
      }
    }
  }, [postDataArray]);

  useEffect(() => {
    if (postData && postFiles.length === postData.length) {
      const orderedFiles: PostFile[] = [];

      for (let post of postDataArray) {
        const fileMatch = postFiles.find((el) => post.s3Key === el.s3Key);

        if (fileMatch) {
          orderedFiles.push(fileMatch);
        }
      }

      setPostFileArray(orderedFiles);
    }
  }, [postFiles]);

  useEffect(() => {
    if (archivePostConfirm) {
      clearArchivePostStatuses();
      setPostOptionsModalShow(false);
      setPostModalShow(false);

      const newDataArray = postDataArray.filter(
        (el) => el.id !== postModalProps.id
      );
      setPostDataArray(newDataArray);

      const newFileArray = postFileArray.filter(
        (el) => el.s3Key !== postModalProps.s3Key
      );
      setPostFileArray(newFileArray);
    }
  }, [archivePostConfirm]);

  const handleRenderPostModal = (file: PostFile) => {
    const postData = postDataArray.find((el) => el.s3Key === file.s3Key);

    if (postData) {
      const caption = postData.caption || '';
      const location = postData.postLocation || '';
      const { createdAt } = postData;

      setPostModalProps({
        id: postData.id,
        caption,
        s3Key: postData.s3Key,
        location,
        createdAt,
        fileString: file.fileString,
      });
      setPostModalShow(true);
    }
  };

  useEffect(() => {
    if (currentUserUsersFollowing?.length) {
      for (let userFollowing of currentUserUsersFollowing) {
        if (userFollowing.userId === user.id) {
          setIsFollowing(true);
        }
      }
    }
  }, [getUsersFollowingConfirm]);

  const handleRenderFollowersModal = () => {
    if (followersArray && followersArray.length) {
      setIsFollowersModal(true);
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleRenderFollowingModal = () => {
    if (usersFollowingArray && usersFollowingArray.length) {
      setIsFollowersModal(false);
      setFollowersOrFollowingModalShow(true);
    }
  };

  const handleMakeStatClickable = (type: string, baseClassName: string) => {
    if (type === 'followers') {
      return followersArray && followersArray.length
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    } else if (type === 'following') {
      return usersFollowingArray && usersFollowingArray.length
        ? `${baseClassName} clickable`
        : `${baseClassName}`;
    }
  };

  return (
    <div className='profile-page'>
      <div className='user-bio'>
        <div className='avatar-and-details'>
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
                <span className='user-bio-photo-placeholder-text'>
                  No photo
                </span>
              </div>
            ) : null}
          </div>
          <div className='user-details'>
            <div className='username-and-edit'>
              <span className='user-username'>{user.username}</span>
              <NavLink className='edit-profile' to='/settings'>
                <span className='edit-text'>Edit profile</span>
              </NavLink>
            </div>
            <NavLink to='/settings' className='edit-profile-narrow-screen'>
              <span className='edit-narrow-text'>Edit profile</span>
            </NavLink>
            <div className='posts-followers-following-stats'>
              <span className='user-stat'>{postDataArray.length} Posts</span>
              <span
                className={handleMakeStatClickable('followers', 'user-stat')}
                onClick={handleRenderFollowersModal}
              >
                {followersArray ? followersArray.length : 0} Followers
              </span>
              <span
                className={handleMakeStatClickable('following', 'user-stat')}
                onClick={handleRenderFollowingModal}
              >
                {usersFollowingArray ? usersFollowingArray.length : 0} Following
              </span>
            </div>
            <div className='name-and-bio'>
              <span className='user-name'>{user.name}</span>
              <span className='user-bio'>{user.bio}</span>
            </div>
          </div>
        </div>
        <div className='name-and-bio-narrow-screen'>
          <span className='user-name-narrow'>{user.name}</span>
          <span className='user-bio-narrow'>{user.bio}</span>
        </div>
        <div className='posts-followers-following-stats-narrow-screen'>
          <ul className='stats-list'>
            <li className='stats-item'>{postDataArray.length} Posts</li>
            <li
              className={handleMakeStatClickable('followers', 'stats-item')}
              onClick={handleRenderFollowersModal}
            >
              {followersArray ? followersArray.length : 0} Followers
            </li>
            <li
              className={handleMakeStatClickable('following', 'stats-item')}
              onClick={handleRenderFollowingModal}
            >
              {usersFollowingArray ? usersFollowingArray.length : 0} Following
            </li>
          </ul>
        </div>
      </div>
      <div className='posts-grid'>
        {postFileArray.length
          ? postFileArray.map((file, idx) => (
              <PostTile
                fileString={file.fileString}
                key={idx}
                onClick={() => handleRenderPostModal(file)}
              />
            ))
          : null}
      </div>
      <PostModal
        show={postModalShow}
        fileString={postModalProps.fileString}
        caption={postModalProps.caption}
        location={postModalProps.location}
        createdAt={
          postModalProps.createdAt || new Date('2021-01-09T22:39:39.945Z')
        }
        onHide={() => setPostModalShow(false)}
        onOptionsClick={() => setPostOptionsModalShow(true)}
        userProfilePhotoFile={profilePhoto || ''}
        userName={user.username}
      />
      <PostOptionsModal
        show={postOptionsModalShow}
        onHide={() => setPostOptionsModalShow(false)}
        archive={() =>
          archivePostStart({
            postId: postModalProps.id,
            s3Key: postModalProps.s3Key,
          })
        }
      />
      <FollowersOrFollowingModal
        users={isFollowersModal ? followersArray : usersFollowingArray}
        show={followersOrFollowingModalShow}
        onHide={() => {
          setFollowersOrFollowingModalShow(false);
          clearUsersPhotoFileArray();
        }}
        isFollowersModal={isFollowersModal}
      />
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  archivePostConfirm: string | null;
  archivePostError: PostError | null;
  followers: Follower[] | null;
  currentUserUsersFollowing: Follower[] | null;
  getUsersFollowingConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postData: selectPostData,
  postFiles: selectPostFiles,
  profilePhotoKey: selectProfilePhotoKey,
  profilePhotoFile: selectProfilePhotoFile,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
  getPostDataConfirm: selectGetPostDataConfirm,
  getPostDataError: selectGetPostDataError,
  getPostFileConfirm: selectGetPostFileConfirm,
  getPostFileError: selectGetPostFileError,
  archivePostConfirm: selectArchivePostConfirm,
  archivePostError: selectArchivePostError,
  followers: selectFollowers,
  currentUserUsersFollowing: selectCurrentUserUsersFollowing,
  getUsersFollowingConfirm: selectGetUsersFollowingConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: (userId: string) => dispatch(getPostDataStart(userId)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  archivePostStart: (archiveReq: ArchivePostReq) =>
    dispatch(archivePostStart(archiveReq)),
  clearArchivePostStatuses: () => dispatch(clearArchivePostStatuses()),
  clearPostState: () => dispatch(clearPostState()),
  getFollowersStart: (userId: string) => dispatch(getFollowersStart(userId)),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
  clearUsersPhotoFileArray: () => dispatch(clearUsersPhotoFileArray()),
  getOtherUserStart: (otherUserRequest: OtherUserRequest) =>
    dispatch(getOtherUserStart(otherUserRequest)),
  clearFollowersAndFollowing: () => dispatch(clearFollowersAndFollowing()),
  clearFollowState: () => dispatch(clearFollowState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
