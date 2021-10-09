import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { PostError } from '../../redux/post/post.types';
import {
  selectPostError,
  selectPostConfirm,
} from '../../redux/post/post.selectors';
import {
  createPostStart,
  clearPostStatuses,
} from '../../redux/post/post.actions';

import {
  Follower,
  UsersFollowingRequest,
  WhoseUsersFollowing,
} from '../../redux/follower/follower.types';
import { getUsersFollowingStart } from '../../redux/follower/follower.actions';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import Alert from 'react-bootstrap/Alert';

import './create-post-page.styles.scss';

interface PostStatus {
  success: boolean;
  error: boolean;
}

interface CreatePostPageProps {
  currentUser: User | null;
  createPostStart: typeof createPostStart;
  postConfirm: string | null;
  postError: PostError | null;
  clearPostStatuses: typeof clearPostStatuses;
  getUsersFollowingStart: typeof getUsersFollowingStart;
}

interface ImgPreview {
  src: string;
  alt: string;
}

export const CreatePostPage: React.FC<CreatePostPageProps> = ({
  currentUser,
  createPostStart,
  postConfirm,
  postError,
  clearPostStatuses,
  getUsersFollowingStart,
}) => {
  const [name, setName] = useState('');
  const [post, setPost] = useState<FormData | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(1610162520423);

  const [showAlert, setShowAlert] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: false,
  });

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      getUsersFollowingStart({
        userId: currentUser.id,
        whoseUsersFollowing: WhoseUsersFollowing.CURRENT_USER,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (postError) {
      setPostStatus({ ...postStatus, error: true });
    } else if (postConfirm) {
      setPostStatus({ ...postStatus, success: true });
    }
  }, [postError, postConfirm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      const formData = new FormData();

      formData.append('photo', file, file.name);

      setPost(formData);
      setImgPreview({ src: URL.createObjectURL(file), alt: file.name });
    } else {
      setPost(null);
      setImgPreview(null);
      setCaption('');
      setLocation('');
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCaption(value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setLocation(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPostStatus({ success: false, error: false });

    if (post) {
      setShowAlert(true);

      if (caption) {
        post.append('caption', caption);
      }
      if (location) {
        post.append('location', location);
      }
      createPostStart(post);
      setTimeout(() => setShowAlert(false), 5000);
    }

    setFileInputKey(Date.now());

    setPost(null);
    setImgPreview(null);
    setCaption('');
    setLocation('');
  };

  const handleRenderAlert = (type: string, message: string) => {
    if (showAlert) {
      clearPostStatuses();
      setTimeout(() => {
        setPostStatus({ success: false, error: false });
        setShowAlert(false);
      }, 3000);
      return (
        <Alert variant={type} onClose={() => setShowAlert(false)} dismissible>
          {message}
        </Alert>
      );
    }
  };

  return (
    <div className='create-post-page'>
      <div>
        <h2>Create a New Post</h2>
      </div>
      <div className='upload'>
        <div className='img-preview-container'>
          {imgPreview || showAlert ? null : (
            <div className='img-preview-placeholder'>
              <div className='placeholder-text-container'>
                <span className='placeholder-text'>Upload an image</span>
              </div>
            </div>
          )}
          {!imgPreview && showAlert ? (
            <div className='alert'>
              {postStatus.error
                ? handleRenderAlert(
                    'danger',
                    'Error uploading post. Please try again.'
                  )
                : null}
              {postStatus.success
                ? handleRenderAlert('success', 'Post uploaded successfully!')
                : null}
            </div>
          ) : null}
          {imgPreview ? (
            <img
              className='img-preview'
              src={imgPreview ? imgPreview.src : ''}
              alt={imgPreview ? imgPreview.alt : ''}
            />
          ) : null}
        </div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <FormFileInput
            name='photo'
            type='file'
            label='Select photo'
            accept='image/*'
            onChange={handleFileChange}
            key={fileInputKey}
          />
          <FormInput
            name='caption'
            type='text'
            label='Add a caption'
            value={caption}
            onChange={handleCaptionChange}
          />
          <FormInput
            name='location'
            type='text'
            label='Where was this taken?'
            value={location}
            onChange={handleLocationChange}
          />
          <div className='button'>
            <Button className='submit-button' onClick={handleSubmit}>
              Upload photo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  postConfirm: string | null;
  postError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostStart: (post: FormData) => dispatch(createPostStart(post)),
  clearPostStatuses: () => dispatch(clearPostStatuses()),
  getUsersFollowingStart: (usersFollowingObj: UsersFollowingRequest) =>
    dispatch(getUsersFollowingStart(usersFollowingObj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostPage);
