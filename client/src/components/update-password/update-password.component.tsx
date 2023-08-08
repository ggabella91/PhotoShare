import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  changePasswordStart,
  clearPasswordStatuses,
} from '../../redux/user/user.actions';

import { AppState } from '../../redux/root-reducer';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import Alert from 'react-bootstrap/Alert';

export const UpdatePassword: React.FC = () => {
  const [userPassword, setUserPassword] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });

  const [, setShowPassAlert] = useState(true);
  const [statusPass, setStatusPass] = useState({
    success: false,
    error: false,
  });

  const userState = useSelector((state: AppState) => state.user);

  const { changePasswordConfirm, changePasswordError } = userState;
  const dispatch = useDispatch();

  const { passwordCurrent, password, passwordConfirm } = userPassword;

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserPassword({ ...userPassword, [name]: value });
  };

  const handleSubmitPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    dispatch(
      changePasswordStart({ passwordCurrent, password, passwordConfirm })
    );
  };

  useEffect(() => {
    if (changePasswordError) {
      setStatusPass({ ...statusPass, error: true });
    } else if (changePasswordConfirm) {
      setStatusPass({ ...statusPass, success: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePasswordError, changePasswordConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    setTimeout(() => {
      setUserPassword({
        passwordCurrent: '',
        password: '',
        passwordConfirm: '',
      });
      setStatusPass({ success: false, error: false });
      dispatch(clearPasswordStatuses());
    }, 5000);
    return (
      <Alert variant={type} onClose={handleHidePassAlert} dismissible>
        {message}
      </Alert>
    );
  };

  const handleHidePassAlert = () => setShowPassAlert(false);

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

export default UpdatePassword;
