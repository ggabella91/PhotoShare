import { shallow } from 'enzyme';
import React from 'react';
import { FeedPage } from '../feed-page/feed-page.component';

import { Post } from '../../redux/post/post.types';

import {
  getOtherUserStart,
  clearFollowersAndFollowing,
} from '../../redux/user/user.actions';

import {
  getPostDataStart,
  getPostFileStart,
  clearPostState,
} from '../../redux/post/post.actions';

import {
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

it('renders a feed page component', () => {
  const feedPageWrapper = shallow(
    <FeedPage
      currentUser={null}
      currentUserUsersFollowing={[]}
      followingInfo={[]}
      clearFollowState={() => clearFollowState()}
      usersProfilePhotoFileArray={[]}
      getUsersFollowingConfirm=''
      clearFollowersAndFollowing={() => clearFollowersAndFollowing()}
      clearPostState={() => clearPostState()}
      postDataFeedArray={[]}
      postConfirm=''
      postError={null}
      postFiles={[]}
      getPostDataConfirm=''
      getPostDataError={null}
      getPostDataStart={(dataReq) => getPostDataStart(dataReq)}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm=''
      getPostFileError={null}
      getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
      getUsersFollowingStart={(usersFollowingRequest) =>
        getUsersFollowingStart(usersFollowingRequest)
      }
    />
  );

  expect(feedPageWrapper).toMatchSnapshot();
});
