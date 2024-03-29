import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Location,
  UploadPart,
  UploadVideoPostFileChunkReq,
} from '../../redux/post/post.types';
import {
  selectLocationSelection,
  selectVideoPostFileChunkMetaData,
  selectPostConfirm,
  selectPostError,
} from '../../redux/post/post.selectors';
import {
  getLocationsSuggestionsStart,
  clearLocationsSuggestions,
  uploadVideoPostFileChunkStart,
  clearPostStatuses,
} from '../../redux/post/post.actions';

import {
  FormInput,
  FormFileInput,
} from '../../components/form-input/form-input.component';
import LocationsSuggestionsContainer, {
  StyleType,
} from '../../components/locations-suggestions-container/locations-suggestions-container.component';
import { useDebounce } from '../../hooks';
import { Button, Typography } from '@mui/material';
import Alert from 'react-bootstrap/Alert';
import LinearProgress from '@mui/material/LinearProgress';

import './create-video-post-page.styles.scss';
import { submitButtonStyles } from '../common-styles';

interface PostStatus {
  success: boolean;
  error: { error: boolean; message: string };
}

interface VideoPreview {
  src: string;
  type: string;
}

interface ChunkIndex {
  idx: number;
  completed: boolean;
}

interface VideoPostPageProps {}

const CreateVideoPostPage: React.FC<VideoPostPageProps> = () => {
  const [thumbnail, setThumbnail] = useState('');
  const [caption, setCaption] = useState('');
  const [locationSearchString, setLocationSearchString] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [videoPreview, setVideoPreview] = useState<VideoPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [chunkIndex, setChunkIndex] = useState<ChunkIndex | null>(null);
  const [uploadPartArray, setUploadPartArray] = useState<UploadPart[]>([]);
  const [totalChunkCount, setTotalChunkCount] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showAlert, setShowAlert] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>({
    success: false,
    error: { error: false, message: '' },
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const videoPostFileChunkMetaData = useSelector(
    selectVideoPostFileChunkMetaData
  );
  const postConfirm = useSelector(selectPostConfirm);
  const postError = useSelector(selectPostError);

  const CHUNK_SIZE = 5 * 1024 * 1024;

  const locationSelection = useSelector(selectLocationSelection);

  const dispatch = useDispatch();

  const debouncedLocationSearchString = useDebounce(locationSearchString, 1000);

  useEffect(() => {
    if (debouncedLocationSearchString.length >= 3 && showSuggestions) {
      dispatch(getLocationsSuggestionsStart(debouncedLocationSearchString));
    }
  }, [dispatch, debouncedLocationSearchString, showSuggestions]);

  useEffect(() => {
    if (locationSelection) {
      setLocation(locationSelection);
      setLocationSearchString(locationSelection.label);
      setShowSuggestions(false);
    }
  }, [locationSelection]);

  const handleLoadedVideoData = () => {
    drawCanvasAndSetThumbnail();
  };

  const handleVideoTimeUpdate = () => {
    drawCanvasAndSetThumbnail();
  };

  const drawCanvasAndSetThumbnail = () => {
    if (canvasRef.current && videoRef.current) {
      const { current: videoEl } = videoRef;
      const { current: canvasEl } = canvasRef;

      const canvasCtx = canvasEl.getContext('2d');
      canvasCtx?.drawImage(
        videoEl,
        5,
        -8,
        videoEl.videoWidth * 0.15,
        videoEl.videoHeight * 0.15
      );

      const canvasDataURL = canvasEl.toDataURL();
      setThumbnail(canvasDataURL);
    }
  };

  useEffect(() => {
    if (
      videoPostFileChunkMetaData &&
      videoFileInputRef.current?.files?.[0] &&
      chunkIndex
    ) {
      const { eTag, partNumber } = videoPostFileChunkMetaData;
      const file = videoFileInputRef.current?.files?.[0];

      const newUploadPart: UploadPart = { ETag: eTag, PartNumber: partNumber };

      const modifiedUploadPartArray = uploadPartArray;
      modifiedUploadPartArray.push(newUploadPart);
      setUploadPartArray(modifiedUploadPartArray);
      const completed = getAllChunksSent(file);
      const idx = completed ? chunkIndex.idx : chunkIndex.idx + 1;
      setChunkIndex({ idx: idx, completed });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPostFileChunkMetaData]);

  useEffect(() => {
    if (
      chunkIndex &&
      videoFileInputRef.current?.files?.[0] &&
      totalChunkCount
    ) {
      setUploadProgress((chunkIndex.idx / totalChunkCount) * 100);
      const file = videoFileInputRef.current?.files?.[0];
      const reader = new FileReader();

      const fileChunk = getCurrentChunkToUpload(file);

      reader.onload = (e) => prepareAndSendFileChunkRequest(e);
      reader.readAsDataURL(fileChunk);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunkIndex, uploadPartArray]);

  useEffect(() => {
    if (postError) {
      setVideoPreview(null);
      setIsUploading(false);
      setUploadPartArray([]);
      setPostStatus({
        ...postStatus,
        error: { error: true, message: postError.message },
      });
    } else if (postConfirm) {
      setVideoPreview(null);
      setIsUploading(false);
      setUploadPartArray([]);
      setPostStatus({ ...postStatus, success: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postError, postConfirm]);

  const getAllChunksSent = (file: File) => {
    const fileSize = file.size;
    const from = chunkIndex!.idx * CHUNK_SIZE + 1;
    return fileSize < from;
  };

  const getCurrentChunkToUpload = (file: File) => {
    const fileSize = file.size;

    const currentIdx = chunkIndex!.idx - 1;

    const from = currentIdx * CHUNK_SIZE;
    const to = Math.min(from + CHUNK_SIZE, fileSize);
    const blob = file.slice(from, to);

    return blob;
  };

  const handleFileChange = () => {
    if (videoFileInputRef.current?.files?.length) {
      const file = videoFileInputRef.current?.files?.[0];

      if (file?.size && file.size >= 104857600) {
        setFileInputKey(Date.now());
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        setTimeout(
          () =>
            setPostStatus({
              ...postStatus,
              error: { error: false, message: '' },
            }),
          5000
        );

        setPostStatus({
          ...postStatus,
          error: {
            error: true,
            message:
              'File size too large. Select a file of maximum 100 MB in size.',
          },
        });
      } else if (file?.size) {
        setVideoPreview({
          src: URL.createObjectURL(
            file.slice(0, Math.min(file.size, CHUNK_SIZE))
          ),
          type: file.type,
        });

        setTotalChunkCount(Math.ceil(file.size / CHUNK_SIZE));
      }
    } else {
      setVideoPreview(null);
      setCaption('');
    }
  };

  const markReadyToUpload = () => {
    setPostStatus({ success: false, error: { error: false, message: '' } });

    if (videoFileInputRef.current?.files?.[0]) {
      setShowAlert(true);

      setChunkIndex({ idx: 1, completed: false });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    markReadyToUpload();
  };

  const handleClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    markReadyToUpload();
  };

  const prepareAndSendFileChunkRequest = (e: ProgressEvent<FileReader>) => {
    const fileChunk = e.target?.result;

    if (fileChunk && videoFileInputRef.current?.files?.[0]) {
      const file = videoFileInputRef.current?.files?.[0];
      const uploadReq: UploadVideoPostFileChunkReq = {};

      if (chunkIndex?.idx === 1 && !chunkIndex?.completed) {
        uploadReq.fileChunk = fileChunk as string;
        uploadReq.fileName = file!.name;
        uploadReq.contentType = file!.type;
        uploadReq.createNewMultipartUpload = true;
        uploadReq.partNumber = chunkIndex!.idx;

        dispatch(uploadVideoPostFileChunkStart(uploadReq));
        setIsUploading(true);
      } else if (chunkIndex?.completed) {
        const { uploadId, key } = videoPostFileChunkMetaData!;
        uploadReq.fileName = file!.name;
        uploadReq.uploadId = uploadId;
        uploadReq.key = key;

        if (caption) {
          uploadReq.caption = caption;
        }
        if (location) {
          uploadReq.location = location;
        }
        if (thumbnail.length) {
          uploadReq.videoThumbnail = thumbnail;
        }

        uploadReq.multiPartUploadArray = uploadPartArray;
        uploadReq.completeMultipartUpload = true;

        dispatch(uploadVideoPostFileChunkStart(uploadReq));

        setCaption('');
        setLocationSearchString('');
        setLocation(null);
        setFileInputKey(Date.now());
      } else {
        uploadReq.fileChunk = fileChunk as string;
        const { uploadId, key } = videoPostFileChunkMetaData!;
        uploadReq.uploadId = uploadId;
        uploadReq.partNumber = chunkIndex!.idx;
        uploadReq.key = key;

        dispatch(uploadVideoPostFileChunkStart(uploadReq));
      }
    }
  };

  const handleRenderAlert = (type: string, message: string) => {
    if (showAlert) {
      dispatch(clearPostStatuses());
      setTimeout(() => {
        setPostStatus({ success: false, error: { error: false, message: '' } });
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
        <Typography variant='h2' sx={{ fontSize: 32, fontWeight: 400 }}>
          Create a New Video Post
        </Typography>
      </div>
      <div className='upload-video'>
        <div className='video-preview-container'>
          {videoPreview || showAlert ? null : (
            <div className='video-preview-placeholder'>
              <div className='placeholder-text-container'>
                <Typography sx={{ fontWeight: 420 }}>Upload a video</Typography>
              </div>
            </div>
          )}
          {!videoPreview && showAlert ? (
            <div className='alert'>
              {postStatus.error.error
                ? handleRenderAlert('danger', postStatus.error.message)
                : null}
              {postStatus.success
                ? handleRenderAlert('success', 'Post uploaded successfully!')
                : null}
            </div>
          ) : null}
          {videoPreview ? (
            <>
              <video
                className='video-preview'
                preload='auto'
                controls
                muted
                ref={videoRef}
                onLoadedData={handleLoadedVideoData}
                onTimeUpdate={handleVideoTimeUpdate}
              >
                <source src={videoPreview.src} type={videoPreview.type} />
                Your browser does not support the video tag.
              </video>
              <canvas className='thumbnail-canvas' ref={canvasRef}></canvas>
            </>
          ) : null}
        </div>
        {isUploading ? (
          <LinearProgress
            className='upload-progress-bar'
            variant='determinate'
            value={uploadProgress}
          />
        ) : null}
        <form encType='multipart/form-data' onSubmit={handleSubmit}>
          <FormFileInput
            name='video'
            type='file'
            label='Select video'
            accept='video/mp4'
            onChange={handleFileChange}
            key={fileInputKey}
            inputRef={videoFileInputRef}
            fileName={videoFileInputRef.current?.files?.[0]?.name || ''}
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
              Upload video
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoPostPage;
