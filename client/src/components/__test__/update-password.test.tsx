import { render } from '../../test-utils/test-utils';

import { UpdatePassword } from '../update-password/update-password.component';

import {
  changePasswordStart,
  clearPasswordStatuses,
} from '../../redux/user/user.actions';

it('renders an update-password component', () => {
  const { container: updatePassword } = render(
    <UpdatePassword
      changePasswordStart={(passwordPayload) =>
        changePasswordStart(passwordPayload)
      }
      changePassError={null}
      changePassConfirm={null}
      clearPasswordStatuses={() => clearPasswordStatuses()}
    />
  );

  expect(updatePassword).toBeInTheDocument();
});
