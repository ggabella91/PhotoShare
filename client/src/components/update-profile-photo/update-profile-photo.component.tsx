import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FieldsToUpdate } from '../../redux/user/user.types';
import { changeInfoStart } from '../../redux/user/user.actions';

import {
  updateProfilePhotoStart,
  clearProfilePhotoStatuses,
} from '../../redux/post/post.actions';
import { AppState } from '../../redux/root-reducer';

import { FormFileInput } from '../form-input/form-input.component';
import Button from '../button/button.component';

import Alert from 'react-bootstrap/Alert';

import './update-profile-photo.styles.scss';

interface ImgPreview {
  src: string;
  alt: string;
}

export const UpdateProfilePhoto: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<FormData | null>(null);
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(1609996842790);
  const [profilePhotoStatus, setProfilePhotoStatus] = useState({
    success: false,
    error: false,
  });
  const [showProfilePhotoAlert, setShowProfilePhotoAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userState = useSelector((state: AppState) => state.user);
  const postState = useSelector((state: AppState) => state.post);
  const dispatch = useDispatch();

  const { currentUser } = userState;
  const {
    profilePhotoConfirm: updateProfilePhotoConfirm,
    profilePhotoError: updateProfilePhotoError,
    profilePhotoKey,
  } = postState;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];

      const formData = new FormData();

      formData.append('profile-photo', file, file.name);

      setProfilePhoto(formData);
      setImgPreview({ src: URL.createObjectURL(file), alt: file.name });
    } else {
      setProfilePhoto(null);
      setImgPreview(null);
    }
  };

  const handleSubmitProfilePhoto = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (currentUser) {
      event.preventDefault();
      setProfilePhotoStatus({ success: false, error: false });

      if (profilePhoto) {
        setShowProfilePhotoAlert(true);

        dispatch(updateProfilePhotoStart(profilePhoto));
        setTimeout(() => setShowProfilePhotoAlert(false), 5000);
      }

      setFileInputKey(Date.now());

      setProfilePhoto(null);
      setImgPreview(null);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (updateProfilePhotoError) {
        setProfilePhotoStatus({ ...profilePhotoStatus, error: true });
      } else if (updateProfilePhotoConfirm) {
        setProfilePhotoStatus({ ...profilePhotoStatus, success: true });
        if (profilePhotoKey && currentUser) {
          const fieldsToUpdate: FieldsToUpdate = {
            name: currentUser.name,
            email: currentUser.email,
            username: currentUser.username,
            bio: currentUser.bio,
            photo: profilePhotoKey,
          };

          dispatch(changeInfoStart(fieldsToUpdate));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateProfilePhotoError, updateProfilePhotoConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    if (currentUser) {
      dispatch(clearProfilePhotoStatuses());
      setTimeout(() => {
        setProfilePhotoStatus({ success: false, error: false });
        setShowProfilePhotoAlert(false);
      }, 3000);
      return (
        <Alert
          variant={type}
          className='photo-alert'
          onClose={handleHideProfilePhotoAlert}
          dismissible
        >
          {message}
        </Alert>
      );
    }
  };

  const handleHideProfilePhotoAlert = () => setShowProfilePhotoAlert(false);

  return (
    <div className='settings'>
      <div className='update-profile-photo'>
        <span>Update your profile photo</span>
        <div className='profile-photo-container'>
          {imgPreview || showProfilePhotoAlert ? null : (
            <div className='img-preview-placeholder'>
              <div className='placeholder-text-container'>
                <span className='placeholder-text'>
                  Select a photo to preview it here
                </span>
              </div>
            </div>
          )}
          {!imgPreview && showProfilePhotoAlert ? (
            <div className='settings-alert'>
              {profilePhotoStatus.error
                ? handleRenderAlert('danger', 'Error updating profile picture.')
                : null}
              {profilePhotoStatus.success
                ? handleRenderAlert(
                    'success',
                    'Profile picture changed successfully!'
                  )
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
        <form encType='multipart/form-data' onSubmit={handleSubmitProfilePhoto}>
          <FormFileInput
            name='profile-photo'
            type='file'
            label='Select photo'
            accept='image/*'
            onChange={handleFileChange}
            key={fileInputKey}
            fileName={fileInputRef.current?.files?.[0]?.name || ''}
            inputRef={fileInputRef}
          />
          <div className='button'>
            <Button
              className='submit-button'
              onClick={handleSubmitProfilePhoto}
            >
              Upload photo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePhoto;
