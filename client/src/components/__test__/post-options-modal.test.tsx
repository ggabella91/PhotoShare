import { shallow } from 'enzyme';
import React from 'react';
import PostOptionsModal from '../post-options-modal/post-options-modal.component';

it('renders a post options modal', () => {
  const postOptionsModalWrapper = shallow(
    <PostOptionsModal show={true} onHide={() => {}} archive={() => {}} />
  );

  expect(postOptionsModalWrapper).toMatchSnapshot();
});
