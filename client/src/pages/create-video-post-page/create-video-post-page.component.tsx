import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Location } from '../../redux/post/post.types';
import {
  selectLocationSelection,
  selectVideoPostFileChunkMetaData,
} from '../../redux/post/post.selectors';
import {
  getLocationsSuggestionsStart,
  clearLocationsSuggestions,
  uploadVideoPostFileChunkStart,
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

import './create-video-post-page.styles.scss';

interface PostStatus {
  success: boolean;
  error: boolean;
}

interface VideoPreview {
  src: string;
  type: string;
}

interface ChunkIndex {
  idx: number;
  completed: boolean;
}

interface UploadPart {
  ETag: string;
  PartNumber: number;
}

interface VideoPostPageProps {}

const CreateVideoPostPage: React.FC<VideoPostPageProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [locationSearchString, setLocationSearchString] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [chunkIndex, setChunkIndex] = useState<ChunkIndex | null>(null);
  const [uploadPartArray, setUploadPartArray] = useState<UploadPart[]>([]);

  const [showAlert, setShowAlert] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const videoPostFileChunkMetaData = useSelector(
    selectVideoPostFileChunkMetaData
  );
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
    if (videoPostFileChunkMetaData && file && chunkIndex) {
      console.log('videoPostFileChunkMetaData: ', videoPostFileChunkMetaData);

      const { eTag, partNumber } = videoPostFileChunkMetaData;

      const newUploadPart: UploadPart = { ETag: eTag, PartNumber: partNumber };

      const modifiedUploadPartArray = uploadPartArray;
      modifiedUploadPartArray.push(newUploadPart);
      setUploadPartArray(modifiedUploadPartArray);
      const completed = getAllChunksSent(file);
      console.log('completed: ', completed);
      const idx = completed ? chunkIndex.idx : chunkIndex.idx + 1;
      setChunkIndex({ idx: idx, completed });
    }
  }, [videoPostFileChunkMetaData]);

  useEffect(() => {
    if (chunkIndex && file) {
      console.log('chunkIndex: ', chunkIndex);

      prepareAndSendFileChunkRequest(file);
    }
  }, [chunkIndex, uploadPartArray]);

  const CHUNK_SIZE = 5 * 1024 * 1024;

  const getAllChunksSent = (file: File) => {
    const fileSize = file.size;
    const from = chunkIndex!.idx * CHUNK_SIZE;
    return fileSize < from;
  };

  const getCurrentChunkToUpload = (file: File) => {
    const fileSize = file.size;

    const currentIdx = chunkIndex!.idx;

    const from = currentIdx * CHUNK_SIZE;
    const to = Math.min(from + CHUNK_SIZE, fileSize);
    const blob = file.slice(from, to);

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

      setFile(file);
    } else {
      setFile(null);
      setVideoPreview(null);
      setCaption('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPostStatus({ success: false, error: false });

    if (file) {
      setShowAlert(true);

      setChunkIndex({ idx: 1, completed: false });

      // setTimeout(() => setShowAlert(false), 5000);
    }

    setFileInputKey(Date.now());

    // setFile(null);
    setVideoPreview(null);
    // setCaption('');
    // setLocationSearchString('');
    // setLocation(null);
  };

  const prepareAndSendFileChunkRequest = (file: File) => {
    const fileChunk = getCurrentChunkToUpload(file);
    const formData = new FormData();
    formData.append('videoChunk', fileChunk);

    if (chunkIndex!.idx === 1) {
      formData.append('fileName', file.name);
      formData.append('createNewMultipartUpload', 'true');
      formData.append('partNumber', `${chunkIndex!.idx}`);

      dispatch(uploadVideoPostFileChunkStart({ formData }));
    } else if (chunkIndex!.completed) {
      const { uploadId, key } = videoPostFileChunkMetaData!;
      formData.append('uploadId', uploadId);
      formData.append('key', key);
      if (caption) {
        formData.append('caption', caption);
      }
      if (location) {
        const locationObjString = JSON.stringify(location);
        formData.append('location', locationObjString);
      }
      const multiPartUploadArray = JSON.stringify(uploadPartArray);
      formData.append('multiPartUploadArray', multiPartUploadArray);
      formData.append('completeMultipartUpload', 'true');
      dispatch(uploadVideoPostFileChunkStart({ formData, complete: true }));
    } else {
      const { uploadId, key } = videoPostFileChunkMetaData!;
      formData.append('uploadId', uploadId);
      formData.append('partNumber', `${chunkIndex!.idx}`);
      formData.append('key', key);
      dispatch(uploadVideoPostFileChunkStart({ formData }));
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
            <video className='video-preview' preload='metadata' controls muted>
              <source src={videoPreview.src} type={videoPreview.type} />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <FormFileInput
            name='video'
            type='file'
            label='Select video'
            accept='video/*'
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
