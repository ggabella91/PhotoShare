import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  selectChangeInfoConfirm,
  selectChangeInfoError,
  selectChangePasswordConfirm,
  selectChangePasswordError,
} from '../../redux/user/user.selectors';
import {
  changeInfoStart,
  changePasswordStart,
  deleteAccountStart,
  checkUserSession,
} from '../../redux/user/user.actions';
import { User, Error, ChangePassword } from '../../redux/user/user.types';
import {
  selectUpdateProfilePhotoError,
  selectUpdateProfilePhotoConfirm,
} from '../../redux/post/post.selectors';
import {
  updateProfilePhotoStart,
  clearProfilePhotoStatuses,
} from '../../redux/post/post.actions';
import { AppState } from '../../redux/root-reducer';

import {
  FormFileInput,
  FormInput,
} from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';
import CustomModal from '../../components/modal/modal.component';

import Alert from 'react-bootstrap/Alert';

import './settings-page.styles.scss';

interface SettingsPageProps {
  updateProfilePhotoConfirm: string | null;
  updateProfilePhotoError: Error | null;
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
  changePassConfirm: string | null;
  changePassError: Error | null;
  updateProfilePhotoStart: typeof updateProfilePhotoStart;
  changeInfoStart: typeof changeInfoStart;
  changePasswordStart: typeof changePasswordStart;
  deleteAccountStart: typeof deleteAccountStart;
  checkUserSession: typeof checkUserSession;
  clearProfilePhotoStatuses: typeof clearProfilePhotoStatuses;
}

interface ImgPreview {
  src: string;
  alt: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  updateProfilePhotoStart,
  updateProfilePhotoError,
  updateProfilePhotoConfirm,
  changeInfoStart,
  changePasswordStart,
  changeInfoError,
  changeInfoConfirm,
  changePassError,
  changePassConfirm,
  deleteAccountStart,
  clearProfilePhotoStatuses,
}) => {
  const [profilePhoto, setProfilePhoto] = useState<FormData | null>(null);
  const [imgPreview, setImgPreview] = useState<ImgPreview | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [profilePhotoStatus, setProfilePhotoStatus] = useState({
    success: false,
    error: false,
  });
  const [showProfilePhotoAlert, setShowProfilePhotoAlert] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const [userPassword, setUserPassword] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [statusInfo, setStatusInfo] = useState({
    success: false,
    error: false,
  });

  const [showPassAlert, setShowPassAlert] = useState(true);
  const [statusPass, setStatusPass] = useState({
    success: false,
    error: false,
  });

  const [modalShow, setModalShow] = useState(false);

  const { name, email } = userInfo;
  const { passwordCurrent, password, passwordConfirm } = userPassword;

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

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeInfoStart({ name, email });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserPassword({ ...userPassword, [name]: value });
  };

  const handleSubmitPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    changePasswordStart({ passwordCurrent, password, passwordConfirm });
  };

  useEffect(() => {
    if (updateProfilePhotoError) {
      setProfilePhotoStatus({ ...profilePhotoStatus, error: true });
    } else if (updateProfilePhotoConfirm) {
      setProfilePhotoStatus({ ...profilePhotoStatus, success: true });
    }
  }, [updateProfilePhotoError, updateProfilePhotoConfirm]);

  useEffect(() => {
    if (changeInfoError) {
      setStatusInfo({ ...statusInfo, error: true });
    } else if (changeInfoConfirm) {
      setStatusInfo({ ...statusInfo, success: true });
    }
  }, [changeInfoError, changeInfoConfirm]);

  useEffect(() => {
    if (changePassError) {
      setStatusPass({ ...statusPass, error: true });
    } else if (changePassConfirm) {
      setStatusPass({ ...statusPass, success: true });
    }
  }, [changePassError, changePassConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    if (type === 'errorInfo' && showInfoAlert) {
      setTimeout(() => {
        setUserInfo({ name: '', email: '' });
        setStatusInfo({ success: false, error: false });
      }, 5000);
      return (
        <Alert
          variant='danger'
          onClose={() => setShowInfoAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    } else if (type === 'errorPass' && showPassAlert) {
      setTimeout(() => {
        setUserPassword({
          passwordCurrent: '',
          password: '',
          passwordConfirm: '',
        });
        setStatusPass({ success: false, error: false });
      }, 5000);
      return (
        <Alert
          variant='danger'
          onClose={() => setShowPassAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    } else if (type === 'errorProfilePhoto' && showProfilePhotoAlert) {
      setTimeout(() => {
        setProfilePhotoStatus({ success: false, error: false });
        setShowProfilePhotoAlert(false);
        clearProfilePhotoStatuses();
      }, 5000);
      return (
        <Alert
          variant='danger'
          onClose={() => setShowProfilePhotoAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    } else if (type === 'successInfo' && showInfoAlert) {
      setTimeout(() => {
        setUserInfo({ name: '', email: '' });
        setStatusInfo({ success: false, error: false });
      }, 5000);
      return (
        <Alert
          variant='success'
          onClose={() => setShowInfoAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    } else if (type === 'successPass' && showPassAlert) {
      setTimeout(() => {
        setUserPassword({
          passwordCurrent: '',
          password: '',
          passwordConfirm: '',
        });
        setStatusPass({ success: false, error: false });
      }, 5000);
      return (
        <Alert
          variant='success'
          onClose={() => setShowPassAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    } else if (type === 'successProfilePhoto' && showProfilePhotoAlert) {
      setTimeout(() => {
        setProfilePhotoStatus({ success: false, error: false });
        setShowProfilePhotoAlert(false);
        clearProfilePhotoStatuses();
      }, 5000);
      return (
        <Alert
          variant='success'
          onClose={() => setShowProfilePhotoAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    }
  };

  return (
    <div className='settings'>
      <h2>Settings</h2>
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
                ? handleRenderAlert(
                    'errorProfilePhoto',
                    'Error updating profile picture.'
                  )
                : null}
              {profilePhotoStatus.success
                ? handleRenderAlert(
                    'successProfilePhoto',
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
      <form className='change-info' onSubmit={handleSubmitInfo}>
        <span>Update your info</span>
        <FormInput
          type='text'
          name='name'
          value={name}
          onChange={handleInfoChange}
          label='name'
        />
        <FormInput
          type='email'
          name='email'
          value={email}
          onChange={handleInfoChange}
          label='email'
        />
        <div className='button'>
          <Button
            className='submit-button settings-button'
            onClick={handleSubmitInfo}
          >
            <span className='update-info'>Update Info</span>
          </Button>
        </div>
      </form>
      <div className='settings-alert'>
        {statusInfo.error
          ? handleRenderAlert('errorInfo', 'Error updating info.')
          : null}
        {statusInfo.success
          ? handleRenderAlert('successInfo', 'Info updated successfully!')
          : null}
      </div>
      <form className='change-info' onSubmit={handleSubmitPassword}>
        <span>Change your password</span>
        <FormInput
          type='password'
          name='passwordCurrent'
          value={passwordCurrent}
          onChange={handlePasswordChange}
          label='current password'
        />
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handlePasswordChange}
          label='new password'
        />
        <FormInput
          type='password'
          name='passwordConfirm'
          value={passwordConfirm}
          onChange={handlePasswordChange}
          label='confirm new password'
        />
        <div className='button'>
          <Button
            className='submit-button settings-button password-button'
            onClick={handleSubmitPassword}
          >
            <span className='update-info password'>Change Password</span>
          </Button>
        </div>
      </form>
      <div className='settings-alert'>
        {statusPass.error
          ? handleRenderAlert('errorPass', 'Error changing password.')
          : null}
        {statusPass.success
          ? handleRenderAlert('successPass', 'Password changed successfully!')
          : null}
      </div>
      <div>
        <Button
          className='submit-button settings-button'
          onClick={() => setModalShow(true)}
        >
          <span>Delete Account</span>
        </Button>
      </div>
      <CustomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        header='Confirm Account Deletion'
        subheader='Are you sure you want to delete your account?'
        bodytext='This action cannot be undone.'
        actionlabel='Delete Account'
        handleconfirm={() => {
          deleteAccountStart();
        }}
      />
    </div>
  );
};

interface LinkStateProps {
  updateProfilePhotoConfirm: string | null;
  updateProfilePhotoError: Error | null;
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
  changePassConfirm: string | null;
  changePassError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  updateProfilePhotoConfirm: selectUpdateProfilePhotoConfirm,
  updateProfilePhotoError: selectUpdateProfilePhotoError,
  changeInfoConfirm: selectChangeInfoConfirm,
  changeInfoError: selectChangeInfoError,
  changePassConfirm: selectChangePasswordConfirm,
  changePassError: selectChangePasswordError,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  updateProfilePhotoStart: (photo: FormData) =>
    dispatch(updateProfilePhotoStart(photo)),
  changeInfoStart: ({ name, email }: User) =>
    dispatch(changeInfoStart({ name, email })),
  changePasswordStart: ({
    passwordCurrent,
    password,
    passwordConfirm,
  }: ChangePassword) =>
    dispatch(
      changePasswordStart({ passwordCurrent, password, passwordConfirm })
    ),
  deleteAccountStart: () => dispatch(deleteAccountStart()),
  checkUserSession: () => dispatch(checkUserSession()),
  clearProfilePhotoStatuses: () => dispatch(clearProfilePhotoStatuses()),
});

export default connect(mapStateToProps, mapDispatchProps)(SettingsPage);
