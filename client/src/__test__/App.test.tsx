import { shallow } from 'enzyme';
import React from 'react';
import { App } from '../App';

import { checkUserSession } from '../redux/user/user.actions';

it('renders app component', () => {
  const appWrapper = shallow(
    <App checkUserSession={() => checkUserSession()} currentUser={null} />
  );

  expect(appWrapper).toMatchSnapshot();
});
