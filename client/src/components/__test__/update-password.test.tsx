import { render, screen, userEvent } from '../../test-utils/test-utils';

import { UpdatePassword } from '../update-password/update-password.component';

describe('update-password component tests', () => {
  const setup = () => {
    const changePasswordStart = jest.fn();
    const clearPasswordStatuses = jest.fn();

    render(
      <UpdatePassword
        changePasswordStart={changePasswordStart}
        clearPasswordStatuses={clearPasswordStatuses}
      />
    );

    return { changePasswordStart, clearPasswordStatuses };
  };

  it('renders an update-password component', () => {
    setup();

    const updatePassword = screen.getByText(/Change your password/i);

    expect(updatePassword).toBeInTheDocument();
  });

  it('clicking change password calls change password start action creator', () => {
    const { changePasswordStart } = setup();

    const changePasswordButton =
      screen.getByText(/Change Password/i).parentElement;

    if (changePasswordButton) userEvent.click(changePasswordButton);

    expect(changePasswordStart).toBeCalled();
  });
});
