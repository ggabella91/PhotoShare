import { shallow } from 'enzyme';
import React from 'react';
import { ForgotPasswordPage } from '../forgot-password/forgot-password-page.component';

import { forgotPasswordStart } from '../../redux/user/user.actions';

it('renders a forgot password page component', () => {
  const forgotPasswordPageWrapper = shallow(
    <ForgotPasswordPage
      forgotPasswordStart={(email) => forgotPasswordStart(email)}
      forgotConfirm={null}
      forgotError={null}
    />
  );

  expect(forgotPasswordPageWrapper).toMatchSnapshot();
});
