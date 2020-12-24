import { shallow } from 'enzyme';
import React from 'react';
import Header from '../header/header.component';

it('renders a header component', () => {
  const headerWrapper = shallow(<Header />);

  expect(headerWrapper).toMatchSnapshot();
});
