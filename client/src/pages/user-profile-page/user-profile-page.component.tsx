import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User, Error } from '../../redux/user/user.types';
import {
  selectOtherUser,
  selectOtherUserError,
} from '../../redux/user/user.selectors';
import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  Post,
  PostFileReq,
  PostFile,
  PostError,
  UserType,
} from '../../redux/post/post.types';
import {
  selectPostData,
  selectPostFiles,
  selectPostError,
  selectPostConfirm,
  selectGetPostDataConfirm,
  selectGetPostDataError,
  selectGetPostFileConfirm,
  selectGetPostFileError,
  selectOtherUserProfilePhotoFile,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
} from '../../redux/post/post.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOptionsModal from '../../components/post-options-modal/post-options-modal.component';

import '../my-profile/profile-page.styles.scss';

interface UserProfilePageProps {
  username: string;
  otherUser: User | null;
  otherUserError: Error | null;
  profilePhotoFile: string | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  getOtherUserStart: typeof getOtherUserStart;
}

interface PostModalProps {
  id: string;
  s3Key: string;
  caption: string;
  location: string;
  createdAt: Date | null;
  fileString: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  username,
  otherUser,
  otherUserError,
  profilePhotoFile,
  postData,
  postFiles,
  getPostDataStart,
  getPostFileStart,
}) => {
  const [user, setUser] = useState({ id: '', name: '', username: '', bio: '' });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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
    if (username) {
      getOtherUserStart(username);
    }
  });

  let history = useHistory();

  useEffect(() => {
    if (otherUserError) {
      history.push('/me');
    }
  });

  useEffect(() => {
    if (otherUser && !user.name) {
      setUser({
        id: otherUser.id,
        name: otherUser.name,
        username: otherUser.username,
        bio: otherUser.bio || '',
      });
      getPostDataStart(user.id);
    }
  }, [otherUser]);

  useEffect(() => {
    if (otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
      });
    } else if (!profilePhotoFile && otherUser && otherUser.photo) {
      getPostFileStart({
        s3Key: otherUser.photo,
        bucket: profileBucket,
        user: UserType.other,
      });
    }
  }, [otherUser]);

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
          user: UserType.other,
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
  otherUser: User | null;
  otherUserError: Error | null;
  postData: Post[] | null;
  postFiles: PostFile[];
  profilePhotoFile: string | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  otherUser: selectOtherUser,
  otherUserError: selectOtherUserError,
  postData: selectPostData,
  postFiles: selectPostFiles,
  profilePhotoFile: selectOtherUserProfilePhotoFile,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
  getPostDataConfirm: selectGetPostDataConfirm,
  getPostDataError: selectGetPostDataError,
  getPostFileConfirm: selectGetPostFileConfirm,
  getPostFileError: selectGetPostFileError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getOtherUserStart: (username: string) =>
    dispatch(getOtherUserStart(username)),
  getPostDataStart: (userId: string) => dispatch(getPostDataStart(userId)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfilePage);