import { shallow } from 'enzyme';
import React from 'react';
import { UpdatePassword } from '../update-password/update-password.component';

import {
  changePasswordStart,
  clearPasswordStatuses,
} from '../../redux/user/user.actions';

it('renders an update-password component', () => {
  const updatePasswordWrapper = shallow(
    <UpdatePassword
      changePasswordStart={(passwordPayload) =>
        changePasswordStart(passwordPayload)
      }
      changePassError={null}
      changePassConfirm={null}
      clearPasswordStatuses={() => clearPasswordStatuses()}
    />
  );

  expect(updatePasswordWrapper).toMatchSnapshot();
});
