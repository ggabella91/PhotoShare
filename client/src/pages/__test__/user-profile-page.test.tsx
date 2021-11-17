import { shallow } from 'enzyme';
import React from 'react';
import { UserProfilePage } from '../user-profile-page/user-profile-page.component';

import { getOtherUserStart } from '../../redux/user/user.actions';

import { PostDataReq, PostFileReq } from '../../redux/post/post.types';
import {
  getPostDataStart,
  getPostFileStart,
} from '../../redux/post/post.actions';

it('renders a my-profile-page component', () => {
  const userProfilePageWrapper = shallow(
    <UserProfilePage
      username='giuliano_gabella'
      otherUser={null}
      otherUserError={null}
      getOtherUserStart={(username) => getOtherUserStart(username)}
      profilePhotoFile={null}
      postData={null}
      postFiles={[]}
      postConfirm={null}
      postError={null}
      getPostDataStart={(postDataReq: PostDataReq) =>
        getPostDataStart(postDataReq)
      }
      getPostDataConfirm={null}
      getPostDataError={null}
      getPostFileStart={(fileReq: PostFileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm={null}
      getPostFileError={null}
    />
  );

  expect(userProfilePageWrapper).toMatchSnapshot();
});
