import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import Alert from 'react-bootstrap/Alert';

import { Error, ResetPassword } from '../../redux/user/user.types';
import { AppState } from '../../redux/root-reducer';
import {
  selectResetError,
  selectResetConfirm,
} from '../../redux/user/user.selectors';
import { resetPasswordStart } from '../../redux/user/user.actions';

import './reset-password-page.styles.scss';

interface ResetPasswordPageProps {
  resetError: Error | null;
  resetConfirm: string | null;
  resetPasswordStart: typeof resetPasswordStart;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  resetError,
  resetConfirm,
  resetPasswordStart,
}) => {
  const [userPassword, setUserPassword] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [showAlert, setShowAlert] = useState(true);
  const [status, setStatus] = useState({ success: false, error: false });
  const { token } = useParams();

  let navigate = useNavigate();

  const { password, passwordConfirm } = userPassword;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setUserPassword({ ...userPassword, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    token && resetPasswordStart({ password, passwordConfirm, token });
  };

  useEffect(() => {
    if (resetError) {
      setStatus({ ...status, error: true });
    } else if (resetConfirm) {
      setStatus({ ...status, success: true });
    }
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

interface LinkStateProps {
  resetError: Error | null;
  resetConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  resetError: selectResetError,
  resetConfirm: selectResetConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetPasswordStart: ({ password, passwordConfirm, token }: ResetPassword) =>
    dispatch(resetPasswordStart({ password, passwordConfirm, token })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
