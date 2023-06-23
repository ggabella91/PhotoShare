import { render, screen, userEvent } from '../../test-utils/test-utils';

import { UpdatePassword } from '../update-password/update-password.component';

describe('update-password component tests', () => {
  const setup = () => {
    console.error = jest.fn();

    render(<UpdatePassword />);
  };

  it('renders an update-password component', () => {
    setup();

    const updatePassword = screen.getByText(/Change your password/i);

    expect(updatePassword).toBeInTheDocument();
  });

  it('clicking change password calls change password start action creator without error', () => {
    setup();

    const changePasswordButton =
      screen.getByText(/Change Password/i).parentElement;

    if (changePasswordButton) userEvent.click(changePasswordButton);

    expect(console.error).not.toHaveBeenCalled();
  });
});
