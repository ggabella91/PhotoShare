import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import {
  selectChangeInfoConfirm,
  selectChangeInfoError,
} from '../../redux/user/user.selectors';
import {
  changeInfoStart,
  deleteAccountStart,
  clearInfoStatuses,
} from '../../redux/user/user.actions';
import { User, Error } from '../../redux/user/user.types';

import { FormInput } from '../form-input/form-input.component';
import Button from '../button/button.component';
import CustomModal from '../modal/modal.component';

import Alert from 'react-bootstrap/Alert';

interface UpdateInfoProps {
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
  changeInfoStart: typeof changeInfoStart;
  clearInfoStatuses: typeof clearInfoStatuses;
  deleteAccountStart: typeof deleteAccountStart;
}

const UpdateInfo: React.FC<UpdateInfoProps> = ({
  changeInfoStart,
  changeInfoError,
  changeInfoConfirm,
  deleteAccountStart,
  clearInfoStatuses,
}) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const [statusInfo, setStatusInfo] = useState({
    success: false,
    error: false,
  });

  const [modalShow, setModalShow] = useState(false);

  const { name, email } = userInfo;

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changeInfoStart({ name, email });
  };

  useEffect(() => {
    if (changeInfoError) {
      setStatusInfo({ ...statusInfo, error: true });
    } else if (changeInfoConfirm) {
      setStatusInfo({ ...statusInfo, success: true });
    }
  }, [changeInfoError, changeInfoConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    setTimeout(() => {
      setUserInfo({ name: '', email: '' });
      setStatusInfo({ success: false, error: false });
      clearInfoStatuses();
    }, 5000);
    return (
      <Alert variant={type} onClose={() => setShowInfoAlert(false)} dismissible>
        {message}
      </Alert>
    );
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
  changeInfoConfirm: string | null;
  changeInfoError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  changeInfoConfirm: selectChangeInfoConfirm,
  changeInfoError: selectChangeInfoError,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  changeInfoStart: ({ name, email }: User) =>
    dispatch(changeInfoStart({ name, email })),

  deleteAccountStart: () => dispatch(deleteAccountStart()),
  clearInfoStatuses: () => dispatch(clearInfoStatuses()),
});

export default connect(mapStateToProps, mapDispatchProps)(UpdateInfo);
