import { shallow } from 'enzyme';
import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

import { resetPasswordStart } from '../../redux/user/user.actions';

it('renders a reset password page component', () => {
  const resetPasswordPageWrapper = shallow(
    <MemoryRouter initialEntries={['/reset-password/sdvb7bgiy4g3487ew']}>
      <Route path='/reset-password/:token'>
        <ResetPasswordPage
          resetPasswordStart={(resetRequest) =>
            resetPasswordStart(resetRequest)
          }
          resetConfirm={null}
          resetError={null}
        />
      </Route>
    </MemoryRouter>
  );

  expect(resetPasswordPageWrapper).toMatchSnapshot();
});
