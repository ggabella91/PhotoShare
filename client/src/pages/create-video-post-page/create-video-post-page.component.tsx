import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { Location } from '../../redux/post/post.types';
import { selectLocationSelection } from '../../redux/post/post.selectors';
import {
  getLocationsSuggestionsStart,
  clearLocationsSuggestions,
} from '../../redux/post/post.actions';

import Button from '../../components/button/button.component';
import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import LocationsSuggestionsContainer, {
  StyleType,
} from '../../components/locations-suggestions-container/locations-suggestions-container.component';
import { useDebounce } from '../hooks';

import axios from 'axios';

import './create-video-post-page.styles.scss';

interface PostStatus {
  success: boolean;
  error: boolean;
}

interface VideoPreview {
  src: string;
  type: string;
}

interface VideoPostPageProps {}

const CreateVideoPostPage: React.FC<VideoPostPageProps> = () => {
  const [fileChunkFormData, setFileChunkFormData] = useState<FormData | null>(
    null
  );
  const [caption, setCaption] = useState('');
  const [locationSearchString, setLocationSearchString] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [chunksArray, setChunksArray] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const locationSelection = useSelector(selectLocationSelection);

  const dispatch = useDispatch();

  const debouncedLocationSearchString = useDebounce(locationSearchString, 1000);

  useEffect(() => {
    if (debouncedLocationSearchString.length >= 3 && showSuggestions) {
      dispatch(getLocationsSuggestionsStart(debouncedLocationSearchString));
    }
  }, [debouncedLocationSearchString]);

  useEffect(() => {
    if (locationSelection) {
      setLocation(locationSelection);
      setLocationSearchString(locationSelection.label);
      setShowSuggestions(false);
    }
  }, [locationSelection]);

  useEffect(() => {
    if (fileChunkFormData) {
      console.log('fileChunkFormData: ', fileChunkFormData);
    }
  }, [fileChunkFormData]);

  const CHUNK_SIZE = 5 * 1024 * 1024;

  const getCurrentChunkToUpload = (file: File, currentChunkIndex: number) => {
    const fileSize = file.size;

    const from = currentChunkIndex * CHUNK_SIZE;
    const to = Math.min(from + CHUNK_SIZE, fileSize);
    const blob = file.slice(from, to);

    console.log('blob: ', blob);

    return blob;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      setVideoPreview({
        src: URL.createObjectURL(file),
        type: file.type,
      });

      console.log('file: ', file);

      const formData = new FormData();

      const firstFileChunk = getCurrentChunkToUpload(file, 1);

      formData.append('videoChunk', firstFileChunk, file.name);

      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   const blobData = e.target?.result || '';
      // };
      // reader.readAsDataURL(firstFileChunk);

      setFileChunkFormData(formData);
    } else {
      setFileChunkFormData(null);
      setVideoPreview(null);
      setCaption('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPostStatus({ success: false, error: false });

    if (fileChunkFormData) {
      setShowAlert(true);

      const formDataToSend = fileChunkFormData;

      formDataToSend.append('createNewMultipartUpload', 'true');
      formDataToSend.append('partNumber', '1');

      axios.post('/api/posts/new-video', formDataToSend).then(
        (data) => {
          console.log('data after response to axios post request: ', data);
        },
        (e) => {
          console.log('axios error: ', e);
        }
      );

      // TODO: Send other formData properties in final request
      // (Add effect to handle this)

      // if (caption) {
      //   fileChunkFormData.append('caption', caption);
      // }

      // if (location) {
      //   const locationObjString = JSON.stringify(location);

      //   fileChunkFormData.append('location', locationObjString);
      // }

      // TODO: Create post redux logic for creating multipart
      // upload video post request

      // dispatch(createPostStart(post));
      // setTimeout(() => setShowAlert(false), 5000);
    }

    setFileInputKey(Date.now());

    setFileChunkFormData(null);
    setVideoPreview(null);
    setCaption('');
    setLocationSearchString('');
    setLocation(null);
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setCaption(value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setLocationSearchString(value);
  };

  const handleFocus = () => setShowSuggestions(true);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch(clearLocationsSuggestions());
      setShowSuggestions(false);
    }
  };

  return (
    <div className='create-video-post-page'>
      <div>
        <h2>Create a New Video Post</h2>
      </div>
      <div className='upload-video'>
        <div className='video-preview-container'>
          {videoPreview || showAlert ? null : (
            <div className='video-preview-placeholder'>
              <div className='placeholder-text-container'>
                <span className='placeholder-text'>Upload a video</span>
              </div>
            </div>
          )}
          {!videoPreview && showAlert ? (
            <div className='alert'>
              {/*
            {postStatus.error
              ? handleRenderAlert(
                'danger',
                  'Error uploading post. Please try again.'
                )
              : null}
            {postStatus.success
              ? handleRenderAlert('success', 'Post uploaded successfully!')
              : null}
            */}
            </div>
          ) : null}
          {videoPreview ? (
            <video className='video-preview' preload='auto' controls muted>
              <source src={videoPreview.src} type={videoPreview.type} />
            </video>
          ) : null}
        </div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <FormFileInput
            name='video'
            type='file'
            label='Select video'
            accept='video/mp4'
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
            value={locationSearchString}
            onChange={handleLocationChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {showSuggestions ? (
            <LocationsSuggestionsContainer styleType={StyleType.createPost} />
          ) : null}
          <div className='button'>
            <Button className='submit-button' onClick={handleSubmit}>
              Upload video
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoPostPage;
