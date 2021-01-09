import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/button/button.component';

import Alert from 'react-bootstrap/Alert';

import { User, Error } from '../../redux/user/user.types';
import { AppState } from '../../redux/root-reducer';
import {
  selectForgotError,
  selectForgotConfirm,
} from '../../redux/user/user.selectors';
import { forgotPasswordStart } from '../../redux/user/user.actions';

import './forgot-password-page.styles.scss';

interface ForgotPasswordPageProps {
  forgotConfirm: string | null;
  forgotError: Error | null;
  forgotPasswordStart: typeof forgotPasswordStart;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  forgotError,
  forgotConfirm,
  forgotPasswordStart,
}) => {
  const [userEmail, setUserEmail] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [status, setStatus] = useState({ success: false, error: false });

  const email = userEmail;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;

    setUserEmail(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    forgotPasswordStart(email);
  };

  useEffect(() => {
    if (forgotError) {
      setStatus({ ...status, error: true });
    } else if (forgotConfirm) {
      setStatus({ ...status, success: true });
    }
  }, [forgotError, forgotConfirm]);

  const handleRenderAlert = (type: string, message: string) => {
    if (type === 'error' && showAlert) {
      setTimeout(() => {
        setUserEmail('');
        setStatus({ success: false, error: false });
      }, 5000);
      return (
        <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>
          {message}
        </Alert>
      );
    } else if (type === 'success' && showAlert) {
      setTimeout(() => {
        setUserEmail('');
        setStatus({ success: false, error: false });
      }, 5000);
      return (
        <Alert
          variant='success'
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      );
    }
  };

  return (
    <div>
      <form className='forgot-password' onSubmit={handleSubmit}>
        <span>
          Enter your email below, and you will be sent a link to reset your
          password!
        </span>
        <FormInput
          type='text'
          name='email'
          value={email}
          onChange={handleChange}
          label='email'
        />
        <div className='button'>
          <Button className='submit-button' onClick={handleSubmit}>
            Send Link
          </Button>
        </div>
      </form>
      <div className='alert'>
        {status.error
          ? handleRenderAlert('error', 'There is no user with this email.')
          : null}
        {status.success
          ? handleRenderAlert('success', 'Password reset link sent!')
          : null}
      </div>
    </div>
  );
};

interface LinkStateProps {
  forgotConfirm: string | null;
  forgotError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  forgotError: selectForgotError,
  forgotConfirm: selectForgotConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  forgotPasswordStart: (email: string) => dispatch(forgotPasswordStart(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
