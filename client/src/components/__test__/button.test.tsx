import { shallow } from 'enzyme';
import React from 'react';
import Button from '../button/button.component';

it('renders a button component', () => {
  const buttonWrapper = shallow(
    <Button className='button-class' onClick={() => console.log('Wheeee!!!')} />
  );

  expect(buttonWrapper).toMatchSnapshot();
});
