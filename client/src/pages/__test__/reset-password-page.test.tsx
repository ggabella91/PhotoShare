import { shallow } from 'enzyme';
import React from 'react';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

import { resetPasswordStart } from '../../redux/user/user.actions';

it('renders a reset password page component', () => {
  const resetPasswordPageWrapper = shallow(
    <ResetPasswordPage
      resetPasswordStart={(resetRequest) => resetPasswordStart(resetRequest)}
      resetConfirm={null}
      resetError={null}
    />
  );

  expect(resetPasswordPageWrapper).toMatchSnapshot();
});
