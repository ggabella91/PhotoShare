import { shallow } from 'enzyme';
import React from 'react';
import { Header } from '../header/header.component';
import { getPostFileStart } from '../../redux/post/post.actions';
import { signOutStart } from '../../redux/user/user.actions';

it('renders a header component', () => {
  const headerWrapper = shallow(
    <Header
      currentUser={null}
      profilePhotoFile='photo'
      profilePhotoKey='photo-key'
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      signOutStart={() => signOutStart()}
    />
  );

  expect(headerWrapper).toMatchSnapshot();
});
