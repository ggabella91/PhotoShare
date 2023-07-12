import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import Alert from 'react-bootstrap/Alert';

import {
  selectResetError,
  selectResetConfirm,
} from '../../redux/user/user.selectors';
import { resetPasswordStart } from '../../redux/user/user.actions';

import './reset-password-page.styles.scss';

export const ResetPasswordPage: React.FC = () => {
  const [userPassword, setUserPassword] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [showAlert, setShowAlert] = useState(true);
  const [status, setStatus] = useState({ success: false, error: false });
  const resetError = useSelector(selectResetError);
  const resetConfirm = useSelector(selectResetConfirm);
  const { token } = useParams();
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const { password, passwordConfirm } = userPassword;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserPassword({ ...userPassword, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    token && dispatch(resetPasswordStart({ password, passwordConfirm, token }));
  };

  useEffect(() => {
    if (resetError) {
      setStatus({ ...status, error: true });
    } else if (resetConfirm) {
      setStatus({ ...status, success: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetError, resetConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    if (showAlert) {
      setTimeout(() => {
        setUserPassword({ password: '', passwordConfirm: '' });
        setStatus({ success: false, error: false });
        if (type === 'success') {
          navigate('/');
        }
      }, 3000);
      return (
        <Alert variant={type} onClose={handleCloseAlert} dismissible>
          {message}
        </Alert>
      );
    }
  };

  const handleCloseAlert = () => setShowAlert(false);

  return (
    <div className='reset-page'>
      <form className='reset-password' onSubmit={handleSubmit}>
        <span>Set your new password below.</span>
        <FormInput
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          label='password'
        />
        <FormInput
          type='password'
          name='passwordConfirm'
          value={passwordConfirm}
          onChange={handleChange}
          label='confirm password'
        />
        <div className='button'>
          <Button className='submit-button reset-button' onClick={handleSubmit}>
            Change Password
          </Button>
        </div>
      </form>
      <div className='alert'>
        {status.error
          ? handleRenderAlert('danger', 'Token is incorrect or has expired.')
          : null}
        {status.success
          ? handleRenderAlert('success', 'Password reset successfully!')
          : null}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
