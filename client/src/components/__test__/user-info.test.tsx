import { shallow } from 'enzyme';
import React from 'react';

import { UserInfo } from '../user-info/user-info.component';

it('renders a user-suggestions component', () => {
  const userInfoWrapper = shallow(<UserInfo userInfoArray={[]} />);

  expect(userInfoWrapper).toMatchSnapshot();
});
