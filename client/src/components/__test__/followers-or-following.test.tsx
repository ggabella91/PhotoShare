import { shallow } from 'enzyme';
import React from 'react';

import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  getPostFileStart,
  clearUsersPhotoFileArray,
} from '../../redux/post/post.actions';

import { FollowersOrFollowingModal } from '../followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

it('renders a user-suggestions component', () => {
  const followersOrFollowingModalWrapper = shallow(
    <FollowersOrFollowingModal
      users={[]}
      show={true}
      onHide={() => {}}
      isFollowersModal={true}
      followersOrFollowing={[]}
      usersProfilePhotoArray={[]}
      usersProfilePhotoConfirm=''
      getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
      getPostFileStart={(postFileReq) => getPostFileStart(postFileReq)}
      clearUsersPhotoFileArray={() => clearUsersPhotoFileArray()}
    />
  );

  expect(followersOrFollowingModalWrapper).toMatchSnapshot();
});
