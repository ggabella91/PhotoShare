import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { Post, PostError } from '../../redux/post/post.types';
import {
  selectPosts,
  selectPostError,
  selectPostConfirm,
} from '../../redux/post/post.selectors';
import { createPostStart } from '../../redux/post/post.actions';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import Alert from 'react-bootstrap/Alert';

import './homepage.styles.scss';

interface PostStatus {
  success: boolean;
  error: boolean;
}

interface HomePageProps {
  currentUser: User | null;
  createPostStart: typeof createPostStart;
  posts: Post[] | null;
  postConfirm: string | null;
  postError: PostError | null;
}

interface ImgPreview {
  src: string;
  alt: string;
}

const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  createPostStart,
  posts,
  postConfirm,
  postError,
}) => {
  const [name, setName] = useState('');
  const [post, setPost] = useState<FormData | null>(null);
  const [caption, setCaption] = useState('');
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: false,
  });

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, []);

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
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCaption(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (post) {
      console.log(post.get('photo'));
      console.log(caption);

      if (caption) {
        post.append('caption', caption);
      }
      createPostStart(post);
    }
    setPost(null);
    setImgPreview(null);
    setCaption('');
  };

  return (
    <div className='homepage'>
      <div>
        <h2>Welcome, {name.split(' ')[0]}!</h2>
      </div>
      <div className='upload'>
        <div className='img-preview-container'>
          {imgPreview ? null : (
            <div className='img-preview-placeholder'>
              <div className='placeholder-text-container'>
                <span className='placeholder-text'>Upload an image</span>
              </div>
            </div>
          )}
          <img
            className='img-preview'
            src={imgPreview ? imgPreview.src : ''}
            alt={imgPreview ? imgPreview.alt : ''}
          />
        </div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <FormFileInput
            name='photo'
            type='file'
            label='Select photo'
            accept='image/*'
            onChange={handleFileChange}
          />
          <FormInput
            name='caption'
            type='text'
            label='Add a caption'
            value={caption}
            onChange={handleCaptionChange}
          />
          <div className='button'>
            <Button className='submit-button' onSubmit={handleSubmit}>
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
  posts: Post[] | null;
  postConfirm: string | null;
  postError: PostError | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  posts: selectPosts,
  postConfirm: selectPostConfirm,
  postError: selectPostError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostStart: (post: FormData) => dispatch(createPostStart(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
