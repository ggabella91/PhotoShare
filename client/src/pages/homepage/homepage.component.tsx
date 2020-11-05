import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import axios from 'axios';

import './homepage.styles.scss';

interface HomePageProps {
  currentUser?: typeof selectCurrentUser;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
  const [name, setName] = useState('');
  const [post, setPost] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setPost(file);
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCaption(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (post) {
      formData.append('post', post, post.name);
      console.log(post.name);
    }
    if (caption) {
      formData.append('caption', caption);
      console.log(caption);
    }

    try {
      await axios.post('/api/posts', { data: formData });
    } catch (err) {
      console.log('An error occurred');
    }
  };

  return (
    <div className='homepage'>
      <div>
        <h2>Welcome, {name.split(' ')[0]}!</h2>
      </div>
      <div className='upload'>
        <h4>Upload a photo</h4>
        <form onSubmit={handleSubmit}>
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
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, null)(HomePage);
