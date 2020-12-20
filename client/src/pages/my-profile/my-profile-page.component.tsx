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
  selectArchivePostConfirm,
  selectArchivePostError,
} from '../../redux/post/post.selectors';
import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
} from '../../redux/post/post.actions';

import PostTile from '../../components/post-tile/post-tile.component';
import PostModal from '../../components/post-modal/post-modal.component';
import PostOptionsModal from '../../components/post-options-modal/post-options-modal.component';

import './my-profile-page.styles.scss';

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
  getPostDataStart: typeof getPostDataStart;
  getPostFileStart: typeof getPostFileStart;
  archivePostStart: typeof archivePostStart;
}

const MyProfilePage: React.FC<MyProfilePageProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  postData,
  postFiles,
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
}) => {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const [postDataArray, setPostDataArray] = useState<Post[]>([]);
  const [postFileArray, setPostFileArray] = useState<PostFile[]>([]);

  const [postModalShow, setPostModalShow] = useState(false);
  const [postModalProps, setPostModalProps] = useState({
    id: '',
    caption: '',
    location: '',
    createdAt: new Date(Date.now()),
    fileString: '',
  });

  const [postOptionsModalShow, setPostOptionsModalShow] = useState(false);

  useEffect(() => {
    if (currentUser && !name) {
      setName(currentUser.name);
      getPostDataStart();
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
          bucket: 'photo-share-app',
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
        location,
        createdAt,
        fileString: file.fileString,
      });
      console.log(postModalProps);
      setPostModalShow(true);
    }
  };

  return (
    <div className='my-profile-page'>
      <div className='user-bio'>
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
        <div className='user-details'>
          <span className='user-name'>{name}</span>
          <span className='user-posts'>{postDataArray.length} Posts</span>
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
        createdAt={postModalProps.createdAt}
        onHide={() => setPostModalShow(false)}
        onOptionsClick={() => setPostOptionsModalShow(true)}
        userProfilePhotoFile={profilePhoto || ''}
        userName={name}
      />
      <PostOptionsModal
        show={postOptionsModalShow}
        onHide={() => setPostOptionsModalShow(false)}
        archive={() => archivePostStart(postModalProps.id)}
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostDataStart: () => dispatch(getPostDataStart()),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  archivePostStart: (postId: string) => dispatch(archivePostStart(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfilePage);
