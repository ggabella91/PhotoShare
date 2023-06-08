import { render, screen, userEvent } from '../../test-utils/test-utils';
import { ForgotPasswordPage } from '../forgot-password/forgot-password-page.component';

describe('forgot password page component tests', () => {
  const setup = () => {
    const forgotPasswordStart = jest.fn();

    render(
      <ForgotPasswordPage
        forgotPasswordStart={forgotPasswordStart}
      />
    );

    return { forgotPasswordStart };
  };

  it('renders a forgot password page component', () => {
    setup();

    const forgotPassword = screen.getByText(
      'Enter your email below, and you will be sent a link to reset your password!'
    );

    expect(forgotPassword).toBeInTheDocument();
  });

  it('clicking send link button calls forgotPasswordStart action creator', () => {
    const { forgotPasswordStart } = setup();

    const sendLinkButton = screen.getByText('Send Link');

    userEvent.click(sendLinkButton);

    expect(forgotPasswordStart).toBeCalled();
  });
});
