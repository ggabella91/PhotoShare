import { shallow } from 'enzyme';
import React from 'react';
import PostModal from '../post-modal/post-modal.component';

it('expect to render a post modal component', () => {
  const modalWrapper = shallow(
    <PostModal
      caption='hi'
      location='here'
      createdAt={new Date(Date.now())}
      show={true}
      fileString='string'
      userName='Giuliano'
      onHide={() => {}}
      onOptionsClick={() => {}}
      userProfilePhotoFile='userFile'
    />
  );

  expect(modalWrapper).toMatchSnapshot();
});