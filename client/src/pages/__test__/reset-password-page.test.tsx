import { render, screen, userEvent } from '../../test-utils/test-utils';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

describe('reset password page component tests', () => {
  const setup = () => {
    console.error = jest.fn();

    render(<ResetPasswordPage />, {
      wrapperProps: {
        route: '/reset-password/:token',
        location: '/reset-password/dasijgfsdhnag',
      },
    });
  };

  it('renders a reset password page component', () => {
    setup();

    const resetPasswordPage = screen.getByText('Set your new password below.');

    expect(resetPasswordPage).toBeInTheDocument();
  });

  it("clicking 'change password' causes resetPasswordStart action creator to be called without throwing an error", () => {
    setup();

    const password = screen.getByLabelText('password');
    const confirmPassword = screen.getByLabelText('confirm password');
    const submitButton = screen.getByText('Change Password');

    userEvent.type(password, 'dis my new password');
    userEvent.type(confirmPassword, 'dis my new password');
    userEvent.click(submitButton);

    expect(console.error).not.toHaveBeenCalled();
  });
});
