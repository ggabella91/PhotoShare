import { render } from '../../test-utils/test-utils';

import { SignUp } from '../sign-up/sign-up.component';
import { signUpStart } from '../../redux/user/user.actions';

it('renders a sign-up component', () => {
  const { container: signUp } = render(
    <SignUp
      signUpStart={(signUpPayload) => signUpStart(signUpPayload)}
      signUpError={null}
    />
  );

  expect(signUp).toBeInTheDocument();
});
