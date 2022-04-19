import { render, screen, userEvent } from '../../test-utils/test-utils';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

describe('reset password page component tests', () => {
  const setup = () => {
    const resetPasswordStart = jest.fn();

    render(
      <ResetPasswordPage
        resetPasswordStart={resetPasswordStart}
        resetConfirm={null}
        resetError={null}
      />,
      {
        wrapperProps: {
          route: '/reset-password/:token',
          location: '/reset-password/dasijgfsdhnag',
        },
      }
    );

    return { resetPasswordStart };
  };

  it('renders a reset password page component', () => {
    setup();

    const resetPasswordPage = screen.getByText('Set your new password below.');

    expect(resetPasswordPage).toBeInTheDocument();
  });

  it("clicking 'change password' causes resetPasswordStart action creator to be called", () => {
    const { resetPasswordStart } = setup();

    const password = screen.getByLabelText('password');
    const confirmPassword = screen.getByLabelText('confirm password');
    const submitButton = screen.getByText('Change Password');

    userEvent.type(password, 'dis my new password');
    userEvent.type(confirmPassword, 'dis my new password');
    userEvent.click(submitButton);

    expect(resetPasswordStart).toBeCalled();
  });
});
