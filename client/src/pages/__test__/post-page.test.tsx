import { shallow } from 'enzyme';
import React from 'react';
import { PostPage } from '../post-page/post-page.component';

import { getUsersFollowingStart } from '../../redux/follower/follower.actions';

import {
  createPostStart,
  clearPostStatuses,
} from '../../redux/post/post.actions';

it('renders a homepage component', () => {
  const postPageWrapper = shallow(
    <PostPage
      currentUser={null}
      createPostStart={(postRequest) => createPostStart(postRequest)}
      postConfirm={null}
      postError={null}
      clearPostStatuses={() => clearPostStatuses()}
      getUsersFollowingStart={(usersFollowingRequest) =>
        getUsersFollowingStart(usersFollowingRequest)
      }
    />
  );

  expect(postPageWrapper).toMatchSnapshot();
});
