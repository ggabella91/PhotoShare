import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { Post, PostActionTypes } from '../../redux/post/post.types';
import { selectPosts, selectPostError } from '../../redux/post/post.selectors';
import { createPostStart } from '../../redux/post/post.actions';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import './homepage.styles.scss';

interface HomePageProps {
  currentUser: User | null;
  createPostStart: typeof createPostStart;
  posts: Post[] | null;
}

const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  createPostStart,
  posts,
}) => {
  const [name, setName] = useState('');
  const [post, setPost] = useState<FormData | null>(null);
  const [caption, setCaption] = useState('');

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
  };

  return (
    <div className='homepage'>
      <div>
        <h2>Welcome, {name.split(' ')[0]}!</h2>
      </div>
      <div className='upload'>
        <h4>Upload a photo</h4>
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
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  posts: selectPosts,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createPostStart: (post: FormData) => dispatch(createPostStart(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
