import { shallow } from 'enzyme';
import React from 'react';
import { MyProfilePage } from '../my-profile/my-profile-page.component';

import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
} from '../../redux/post/post.actions';

it('renders a my-profile-page component', () => {
  const myProfilePageWrapper = shallow(
    <MyProfilePage
      currentUser={null}
      profilePhotoKey={null}
      profilePhotoFile={null}
      postData={null}
      postFiles={[]}
      postConfirm={null}
      postError={null}
      getPostDataStart={() => getPostDataStart()}
      getPostDataConfirm={null}
      getPostDataError={null}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm={null}
      getPostFileError={null}
      archivePostStart={(archivePostReq) => archivePostStart(archivePostReq)}
      archivePostConfirm={null}
      archivePostError={null}
    />
  );

  expect(myProfilePageWrapper).toMatchSnapshot();
});
