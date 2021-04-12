import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import {
  selectCurrentUser,
  selectChangeInfoConfirm,
  selectChangeInfoError,
} from '../../redux/user/user.selectors';
import {
  changeInfoStart,
  deleteAccountStart,
  clearInfoStatuses,
} from '../../redux/user/user.actions';
import { User, FieldsToUpdate, Error } from '../../redux/user/user.types';

import { FormInput } from '../form-input/form-input.component';
import Button from '../button/button.component';
import CustomModal from '../modal/modal.component';

import Alert from 'react-bootstrap/Alert';

interface UpdateInfoProps {
  currentUser: User | null;
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
  changeInfoStart: typeof changeInfoStart;
  clearInfoStatuses: typeof clearInfoStatuses;
  deleteAccountStart: typeof deleteAccountStart;
}

export const UpdateInfo: React.FC<UpdateInfoProps> = ({
  currentUser,
  changeInfoStart,
  changeInfoError,
  changeInfoConfirm,
  deleteAccountStart,
  clearInfoStatuses,
}) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
  });

  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [statusInfo, setStatusInfo] = useState({
    success: false,
    error: false,
  });

  const [modalShow, setModalShow] = useState(false);

  const { name, email, username, bio } = userInfo;

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

      changeInfoStart(fieldsToUpdate);
      setUserInfo({ name: '', email: '', username: '', bio: '' });
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (changeInfoError) {
        setStatusInfo({ ...statusInfo, error: true });
      } else if (changeInfoConfirm) {
        setStatusInfo({ ...statusInfo, success: true });
      }
    }
  }, [changeInfoError, changeInfoConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    if (currentUser) {
      clearInfoStatuses();
      setTimeout(() => {
        setStatusInfo({ success: false, error: false });
      }, 3000);
      return (
        <Alert
          variant={type}
          onClose={() => setShowInfoAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    }
  };

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
  currentUser: User | null;
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  changeInfoConfirm: selectChangeInfoConfirm,
  changeInfoError: selectChangeInfoError,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  changeInfoStart: (fieldsToUpdate: FieldsToUpdate) =>
    dispatch(changeInfoStart(fieldsToUpdate)),

  deleteAccountStart: () => dispatch(deleteAccountStart()),
  clearInfoStatuses: () => dispatch(clearInfoStatuses()),
});

export default connect(mapStateToProps, mapDispatchProps)(UpdateInfo);
