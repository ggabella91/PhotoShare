import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { PostError } from '../../redux/post/post.types';

import { User, FieldsToUpdate } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { changeInfoStart } from '../../redux/user/user.actions';

import {
  selectUpdateProfilePhotoError,
  selectUpdateProfilePhotoConfirm,
  selectProfilePhotoKey,
} from '../../redux/post/post.selectors';
import {
  updateProfilePhotoStart,
  clearProfilePhotoStatuses,
} from '../../redux/post/post.actions';
import { AppState } from '../../redux/root-reducer';

import { FormFileInput } from '../form-input/form-input.component';
import Button from '../button/button.component';

import Alert from 'react-bootstrap/Alert';

import './update-profile-photo.styles.scss';

interface UpdateProfilePhotoProps {
  updateProfilePhotoConfirm: string | null;
  updateProfilePhotoError: PostError | null;
  updateProfilePhotoStart: typeof updateProfilePhotoStart;
  profilePhotoKey: string | null;
  clearProfilePhotoStatuses: typeof clearProfilePhotoStatuses;
  currentUser: User | null;
  changeInfoStart: typeof changeInfoStart;
}

interface ImgPreview {
  src: string;
  alt: string;
}

export const UpdateProfilePhoto: React.FC<UpdateProfilePhotoProps> = ({
  updateProfilePhotoStart,
  updateProfilePhotoError,
  updateProfilePhotoConfirm,
  clearProfilePhotoStatuses,
  profilePhotoKey,
  changeInfoStart,
  currentUser,
}) => {
  const [profilePhoto, setProfilePhoto] = useState<FormData | null>(null);
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(1609996842790);
  const [profilePhotoStatus, setProfilePhotoStatus] = useState({
    success: false,
    error: false,
  });
  const [showProfilePhotoAlert, setShowProfilePhotoAlert] = useState(false);

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
    event.preventDefault();
    setProfilePhotoStatus({ success: false, error: false });

    if (profilePhoto) {
      setShowProfilePhotoAlert(true);
      console.log('Got here baby!');

      updateProfilePhotoStart(profilePhoto);
      setTimeout(() => setShowProfilePhotoAlert(false), 5000);
    }

    setFileInputKey(Date.now());

    setProfilePhoto(null);
    setImgPreview(null);
  };

  useEffect(() => {
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

        changeInfoStart(fieldsToUpdate);
      }
    }
  }, [updateProfilePhotoError, updateProfilePhotoConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    setTimeout(() => {
      setProfilePhotoStatus({ success: false, error: false });
      setShowProfilePhotoAlert(false);
      clearProfilePhotoStatuses();
    }, 5000);
    return (
      <Alert
        variant={type}
        className='photo-alert'
        onClose={() => setShowProfilePhotoAlert(false)}
        dismissible
      >
        {message}
      </Alert>
    );
  };

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

interface LinkStateProps {
  updateProfilePhotoConfirm: string | null;
  updateProfilePhotoError: PostError | null;
  profilePhotoKey: string | null;
  currentUser: User | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  updateProfilePhotoConfirm: selectUpdateProfilePhotoConfirm,
  updateProfilePhotoError: selectUpdateProfilePhotoError,
  profilePhotoKey: selectProfilePhotoKey,
  currentUser: selectCurrentUser,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  updateProfilePhotoStart: (photo: FormData) =>
    dispatch(updateProfilePhotoStart(photo)),

  clearProfilePhotoStatuses: () => dispatch(clearProfilePhotoStatuses()),
  changeInfoStart: (fieldsToUpdate: FieldsToUpdate) =>
    dispatch(changeInfoStart(fieldsToUpdate)),
});

export default connect(mapStateToProps, mapDispatchProps)(UpdateProfilePhoto);
