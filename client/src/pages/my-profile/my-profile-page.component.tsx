import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {
  Post,
  PostFileReq,
  PostFile,
  PostError,
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
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
} from '../../redux/post/post.actions';

import './my-profile-page.styles.scss';

interface MyProfilePageProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  postData: Post[] | null;
  postFiles: PostFile[] | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
}

const MyProfilePage: React.FC<MyProfilePageProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  postData,
  postFiles,
  postConfirm,
  postError,
  getPostDataConfirm,
  getPostDataError,
  getPostFileConfirm,
  getPostFileError,
  getPostDataStart,
  getPostFileStart,
}) => {
  const [name, setName] = useState('');
  const [photoFile, setPhotoFile] = useState<string | null>(null);

  const [postDataArray, setPostDataArray] = useState<Post[]>([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket: 'photo-share-app-profile-photos',
      });
    } else if (!profilePhotoFile && currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket: 'photo-share-app-profile-photos',
      });
    }
  }, [profilePhotoKey]);

  useEffect(() => {
    if (profilePhotoFile) {
      setPhotoFile(profilePhotoFile);
    }

    if (postData) {
      setPostDataArray(postData);
    }
  }, [profilePhotoFile]);

  return (
    <div className='my-profile-page'>
      <div className='user-bio'>
        <div className='avatar'>
          {photoFile ? (
            <img
              className='profile-photo'
              src={`data:image/jpeg;base64,${photoFile}`}
              alt='profile-pic'
            />
          ) : null}
          {!photoFile ? (
            <div className='user-bio-photo-placeholder'>
              <span className='user-bio-photo-placeholder-text'>No photo</span>
            </div>
          ) : null}
        </div>
        <div className='user-details'>
          <span className='user-name'>{name}</span>
          <span className='user-posts'>{postDataArray.length} Posts</span>
        </div>
      </div>
      <div className='posts-grid'></div>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postData: Post[] | null;
  postFiles: PostFile[] | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  postConfirm: string | null;
  postError: PostError | null;
  getPostDataConfirm: string | null;
  getPostDataError: PostError | null;
  getPostFileConfirm: string | null;
  getPostFileError: PostError | null;
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: () => dispatch(getPostDataStart()),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
