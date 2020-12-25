import { shallow } from 'enzyme';
import React from 'react';
import { SignUp } from '../sign-up/sign-up.component';
import { signUpStart } from '../../redux/user/user.actions';

it('renders a sign-up component', () => {
  const signUpWrapper = shallow(
    <SignUp
      signUpStart={(signUpPayload) => signUpStart(signUpPayload)}
      signUpError={null}
    />
  );

  expect(signUpWrapper).toMatchSnapshot();
});
