import { render } from '../../test-utils/test-utils';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

import { resetPasswordStart } from '../../redux/user/user.actions';

it('renders a reset password page component', () => {
  const { container: resetPasswordPage } = render(
    <ResetPasswordPage
      resetPasswordStart={(resetRequest) => resetPasswordStart(resetRequest)}
      resetConfirm={null}
      resetError={null}
    />
  );

  expect(resetPasswordPage).toBeInTheDocument();
});
