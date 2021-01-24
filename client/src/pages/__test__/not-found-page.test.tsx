import { shallow } from 'enzyme';
import React from 'react';

import '../not-found/not-found-page.component';
import NotFoundPage from '../not-found/not-found-page.component';

it('renders a not-found page component', () => {
  const notFoundPageWrapper = shallow(<NotFoundPage />);

  expect(notFoundPageWrapper).toMatchSnapshot();
});
