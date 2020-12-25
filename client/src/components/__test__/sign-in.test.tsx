import { shallow } from 'enzyme';
import React from 'react';
import { SignIn } from '../sign-in/sign-in.component';
import { signInStart } from '../../redux/user/user.actions';

it('renders a sign-in component', () => {
  const signInWrapper = shallow(
    <SignIn
      signInStart={(signInPayload) => signInStart(signInPayload)}
      signInError={null}
    />
  );

  expect(signInWrapper).toMatchSnapshot();
});
