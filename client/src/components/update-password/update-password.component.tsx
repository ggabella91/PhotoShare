import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  selectChangePasswordConfirm,
  selectChangePasswordError,
} from '../../redux/user/user.selectors';
import {
  changePasswordStart,
  clearPasswordStatuses,
} from '../../redux/user/user.actions';
import { Error, ChangePassword } from '../../redux/user/user.types';

import { AppState } from '../../redux/root-reducer';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import Alert from 'react-bootstrap/Alert';

interface UpdatePasswordProps {
  changePassConfirm: string | null;
  changePassError: Error | null;
  changePasswordStart: typeof changePasswordStart;
  clearPasswordStatuses: typeof clearPasswordStatuses;
}

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  changePasswordStart,
  changePassError,
  changePassConfirm,
  clearPasswordStatuses,
}) => {
  const [userPassword, setUserPassword] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const [showPassAlert, setShowPassAlert] = useState(true);
  const [statusPass, setStatusPass] = useState({
    success: false,
    error: false,
  });

  const { passwordCurrent, password, passwordConfirm } = userPassword;

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
    if (changePassError) {
      setStatusPass({ ...statusPass, error: true });
    } else if (changePassConfirm) {
      setStatusPass({ ...statusPass, success: true });
    }
  }, [changePassError, changePassConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    setTimeout(() => {
      setUserPassword({
        passwordCurrent: '',
        password: '',
        passwordConfirm: '',
      });
      setStatusPass({ success: false, error: false });
      clearPasswordStatuses();
    }, 5000);
    return (
      <Alert variant={type} onClose={() => setShowPassAlert(false)} dismissible>
        {message}
      </Alert>
    );
  };

  return (
    <div className='settings'>
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
          ? handleRenderAlert('danger', 'Error changing password.')
          : null}
        {statusPass.success
          ? handleRenderAlert('success', 'Password changed successfully!')
          : null}
      </div>
    </div>
  );
};

interface LinkStateProps {
  changePassConfirm: string | null;
  changePassError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  changePassConfirm: selectChangePasswordConfirm,
  changePassError: selectChangePasswordError,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  changePasswordStart: ({
    passwordCurrent,
    password,
    passwordConfirm,
  }: ChangePassword) =>
    dispatch(
      changePasswordStart({ passwordCurrent, password, passwordConfirm })
    ),
  clearPasswordStatuses: () => dispatch(clearPasswordStatuses()),
});

export default connect(mapStateToProps, mapDispatchProps)(UpdatePassword);
