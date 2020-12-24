import { shallow } from 'enzyme';
import React from 'react';
import { Header } from '../header/header.component';
import { PostFileReq } from '../../redux/post/post.types';
import { getPostFileStart } from '../../redux/post/post.actions';
import { signOutStart } from '../../redux/user/user.actions';

it('renders a header component', () => {
  // const fileReq: PostFileReq = { s3Key: 'key', bucket: 'bucket' };

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
