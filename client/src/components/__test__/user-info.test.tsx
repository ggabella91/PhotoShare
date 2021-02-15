import { shallow } from 'enzyme';
import React from 'react';

import { UserInfo, StyleType } from '../user-info/user-info.component';

it('renders a user-suggestions component', () => {
  const userInfoWrapper = shallow(
    <UserInfo userInfoArray={[]} styleType={StyleType.SEARCH} />
  );

  expect(userInfoWrapper).toMatchSnapshot();
});
