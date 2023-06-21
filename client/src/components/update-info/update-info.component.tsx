import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../redux/root-reducer';

import {
  changeInfoStart,
  deleteAccountStart,
  clearInfoStatuses,
} from '../../redux/user/user.actions';
import { FieldsToUpdate } from '../../redux/user/user.types';

import { FormInput } from '../form-input/form-input.component';
import Button from '../button/button.component';
import DeleteAccountConfirmModal from '../delete-account-confirm-modal/delete-account-confirm-modal.component';

import Alert from 'react-bootstrap/Alert';

export const UpdateInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
  });

  const [, setShowInfoAlert] = useState(true);
  const [statusInfo, setStatusInfo] = useState({
    success: false,
    error: false,
  });

  const [modalShow, setModalShow] = useState(false);

  const userState = useSelector((state: AppState) => state.user);
  const dispatch = useDispatch();

  const { currentUser, changeInfoConfirm, changeInfoError } = userState;

  const { name, email, username, bio } = userInfo;

  useEffect(() => {
    if (currentUser) {
      setUserInfo({
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
        bio: currentUser.bio || '',
      });
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (changeInfoError) {
        setStatusInfo({ ...statusInfo, error: true });
      } else if (changeInfoConfirm) {
        setStatusInfo({ ...statusInfo, success: true });
      }
    }
  }, [changeInfoError, changeInfoConfirm]);

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    if (currentUser) {
      event.preventDefault();

      const fieldsToUpdate: FieldsToUpdate = {};

      fieldsToUpdate.name = name ? name : currentUser!.name;
      fieldsToUpdate.email = email ? email : currentUser!.email;
      fieldsToUpdate.username = username ? username : currentUser!.username;
      fieldsToUpdate.bio = bio ? bio : currentUser!.bio;

      dispatch(changeInfoStart(fieldsToUpdate));
      setUserInfo({ name: '', email: '', username: '', bio: '' });
    }
  };

  const handleRenderAlert = (type: string, message: string) => {
    if (currentUser) {
      dispatch(clearInfoStatuses());
      setTimeout(() => {
        setStatusInfo({ success: false, error: false });
      }, 3000);
      return (
        <Alert variant={type} onClose={handleHideAlert} dismissible>
          {message}
        </Alert>
      );
    }
  };

  const handleHideAlert = () => setShowInfoAlert(false);

  const handleShowAccountDeletionModal = () => setModalShow(true);

  const handleHideAccountDeletionModal = () => setModalShow(false);

  const handleDeleteAccount = () => dispatch(deleteAccountStart());

  return (
    <div className='settings'>
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
        <FormInput
          type='text'
          name='username'
          value={username}
          onChange={handleInfoChange}
          label='username'
        />
        <FormInput
          type='text'
          name='bio'
          value={bio}
          onChange={handleInfoChange}
          label='bio'
        />
        <div className='button'>
          <Button
            className='submit-button settings-button'
            onClick={handleSubmitInfo}
            dataTestId='update-info-button'
          >
            <span className='update-info'>Update Info</span>
          </Button>
        </div>
      </form>
      <div className='settings-alert'>
        {statusInfo.error
          ? handleRenderAlert('danger', 'Error updating info.')
          : null}
        {statusInfo.success
          ? handleRenderAlert('success', 'Info updated successfully!')
          : null}
      </div>
      <div>
        <Button
          className='submit-button settings-button delete'
          onClick={handleShowAccountDeletionModal}
          dataTestId='delete-account-button'
        >
          <span>Delete Account</span>
        </Button>
      </div>
      <DeleteAccountConfirmModal
        show={modalShow}
        onHide={handleHideAccountDeletionModal}
        header='Confirm Account Deletion'
        subheader='Are you sure you want to delete your account?'
        bodytext='This action cannot be undone.'
        actionlabel='Delete Account'
        onSubmit={handleDeleteAccount}
        dataTestId='confirm-delete-modal'
      />
    </div>
  );
};

export default UpdateInfo;
