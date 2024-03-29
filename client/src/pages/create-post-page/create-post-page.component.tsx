import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppState } from '../../redux/root-reducer';
import { Location } from '../../redux/post/post.types';
import {
  createPostStart,
  clearPostStatuses,
  getLocationsSuggestionsStart,
  clearLocationsSuggestions,
} from '../../redux/post/post.actions';

import { useDebounce } from '../../hooks';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import { Button, Typography } from '@mui/material';
import Alert from 'react-bootstrap/Alert';
import LocationsSuggestionsContainer, {
  StyleType,
} from '../../components/locations-suggestions-container/locations-suggestions-container.component';

import './create-post-page.styles.scss';
import { submitButtonStyles } from '../common-styles';

interface PostStatus {
  success: boolean;
  error: boolean;
}

interface ImgPreview {
  src: string;
  alt: string;
}

export const CreatePostPage: React.FC = () => {
  const [post, setPost] = useState<FormData | null>(null);
  const [caption, setCaption] = useState('');
  const [locationSearchString, setLocationSearchString] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [showAlert, setShowAlert] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();
  const postState = useSelector((state: AppState) => state.post);
  const { postConfirm, postError, locationSelection } = postState;

  useEffect(() => {
    if (postError) {
      setPostStatus({ ...postStatus, error: true });
    } else if (postConfirm) {
      setPostStatus({ ...postStatus, success: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postError, postConfirm]);

  const debouncedLocationSearchString = useDebounce(locationSearchString, 1000);

  useEffect(() => {
    if (debouncedLocationSearchString.length >= 3 && showSuggestions) {
      dispatch(getLocationsSuggestionsStart(debouncedLocationSearchString));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocationSearchString]);

  useEffect(() => {
    if (locationSelection) {
      setLocation(locationSelection);
      setLocationSearchString(locationSelection.label);
      setShowSuggestions(false);
    }
  }, [locationSelection]);

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current?.files?.[0];

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

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setLocationSearchString(value);
  };

  const prepareAndSubmitUpload = () => {
    setPostStatus({ success: false, error: false });

    if (post) {
      setShowAlert(true);

      if (caption) {
        post.append('caption', caption);
      }

      if (location) {
        const locationObjString = JSON.stringify(location);

        post.append('location', locationObjString);
      }

      dispatch(createPostStart(post));
      setTimeout(() => setShowAlert(false), 5000);
    }

    setFileInputKey(Date.now());

    setPost(null);
    setImgPreview(null);
    setCaption('');
    setLocationSearchString('');
    setLocation(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submit event called');
    event.preventDefault();
    prepareAndSubmitUpload();
  };

  const handleClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    prepareAndSubmitUpload();
  };

  const handleRenderAlert = (type: string, message: string) => {
    if (showAlert) {
      dispatch(clearPostStatuses());
      setTimeout(() => {
        setPostStatus({ success: false, error: false });
        setShowAlert(false);
      }, 3000);
      return (
        <Alert variant={type} onClose={handleCloseAlert} dismissible>
          {message}
        </Alert>
      );
    }
  };

  const handleCloseAlert = () => setShowAlert(false);

  const handleFocus = () => setShowSuggestions(true);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch(clearLocationsSuggestions());
      setShowSuggestions(false);
    }
  };

  return (
    <div className='create-post-page'>
      <div>
        <Typography variant='h2' sx={{ fontSize: 32, fontWeight: 400 }}>
          Create a New Image Post
        </Typography>
      </div>
      <div className='upload'>
        <div className='img-preview-container'>
          {imgPreview || showAlert ? null : (
            <div className='img-preview-placeholder'>
              <div className='placeholder-text-container'>
                <Typography sx={{ fontWeight: 420 }}>
                  Upload an image
                </Typography>
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
            inputRef={fileInputRef}
            fileName={fileInputRef?.current?.files?.[0]?.name || ''}
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
            value={locationSearchString}
            onChange={handleLocationChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {showSuggestions ? (
            <LocationsSuggestionsContainer styleType={StyleType.createPost} />
          ) : null}
          <div
            className='button'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant='contained'
              type='submit'
              sx={submitButtonStyles}
              onClick={handleClickSubmit}
              disableRipple
            >
              Upload photo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
