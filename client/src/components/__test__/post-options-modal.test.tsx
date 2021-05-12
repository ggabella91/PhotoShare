import { shallow } from 'enzyme';
import React from 'react';
import PostOptionsModal from '../post-or-comment-options-modal/post-or-comment-options-modal.component';

it('renders a post options modal', () => {
  const postOptionsModalWrapper = shallow(
    <PostOptionsModal show={true} onHide={() => {}} archive={() => {}} />
  );

  expect(postOptionsModalWrapper).toMatchSnapshot();
});
