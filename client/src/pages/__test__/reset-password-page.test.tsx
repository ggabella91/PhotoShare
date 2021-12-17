import { render, screen } from '../../test-utils/test-utils';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

describe('reset password page component tests', () => {
  const setup = () => {
    const resetPasswordStart = jest.fn();

    render(
      <ResetPasswordPage
        resetPasswordStart={resetPasswordStart}
        resetConfirm={null}
        resetError={null}
      />
    );
  };

  it('renders a reset password page component', () => {
    setup();

    const resetPasswordPage = screen.getByText('Set your new password below.');

    expect(resetPasswordPage).toBeInTheDocument();
  });
});
