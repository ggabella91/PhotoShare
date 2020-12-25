import { shallow } from 'enzyme';
import React from 'react';
import Footer from '../footer/footer.component';

it('renders a footer component', () => {
  const footerWrapper = shallow(<Footer />);

  expect(footerWrapper).toMatchSnapshot();
});
