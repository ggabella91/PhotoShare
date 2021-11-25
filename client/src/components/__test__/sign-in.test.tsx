import { render } from '../../test-utils/test-utils';

import { SignIn } from '../sign-in/sign-in.component';
import { signInStart } from '../../redux/user/user.actions';

it('renders a sign-in component', () => {
  const { container: signIn } = render(
    <SignIn
      signInStart={(signInPayload) => signInStart(signInPayload)}
      signInError={null}
    />
  );

  expect(signIn).toBeInTheDocument();
});
