import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
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
  clearPostState,
} from '../../redux/post/post.actions';

import { Follower } from '../../redux/follower/follower.types';
import {
  selectFollowers,
  selectUsersFollowing,
} from '../../redux/follower/follower.selectors';
import {
  getFollowersStart,
  getUsersFollowingStart,
} from '../../redux/follower/follower.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOptionsModal from '../../components/post-options-modal/post-options-modal.component';

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
  usersFollowing: Follower[] | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
  clearArchivePostStatuses: typeof clearArchivePostStatuses;
  clearPostState: typeof clearPostState;
  getFollowersStart: typeof getFollowersStart;
  getUsersFollowingStart: typeof getUsersFollowingStart;
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
  followers: Follower[] | null;
  usersFollowing: Follower[] | null;
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
  clearPostState,
  followers,
  usersFollowing,
  getFollowersStart,
  getUsersFollowingStart,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [
    followersAndUsersFollowing,
    setFollowersAndUsersFollowing,
  ] = useState<FollowersAndUsersFollowing>({
    followers: null,
    usersFollowing: null,
  });

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
      setUser({
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio || '',
      });
      getPostDataStart(currentUser.id);
      getFollowersStart(currentUser.id);
      getUsersFollowingStart(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (followers) {
      setFollowersAndUsersFollowing({
        ...followersAndUsersFollowing,
        followers,
      });
    }

    if (usersFollowing) {
      setFollowersAndUsersFollowing({
        ...followersAndUsersFollowing,
        usersFollowing,
      });
    }
  }, [followers, usersFollowing]);

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
            <span className='user-posts'>{postDataArray.length} Posts</span>
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
        <div className='user-posts-narrow-screen'>
          <ul className='stats-list'>
            <li className='stats-item'>{postDataArray.length} Posts</li>
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
  usersFollowing: Follower[] | null;
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
  usersFollowing: selectUsersFollowing,
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
  getUsersFollowingStart: (userId: string) =>
    dispatch(getUsersFollowingStart(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
