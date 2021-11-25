import { render } from '../../test-utils/test-utils';
import { ForgotPasswordPage } from '../forgot-password/forgot-password-page.component';

import { forgotPasswordStart } from '../../redux/user/user.actions';

it('renders a forgot password page component', () => {
  const { container: forgotPasswordPageWrapper } = render(
    <ForgotPasswordPage
      forgotPasswordStart={(email) => forgotPasswordStart(email)}
      forgotConfirm={null}
      forgotError={null}
    />
  );

  expect(forgotPasswordPageWrapper).toBeInTheDocument();
});
