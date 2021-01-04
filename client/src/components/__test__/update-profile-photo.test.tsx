import { shallow } from 'enzyme';
import React from 'react';
import { UpdateProfilePhoto } from '../update-profile-photo/update-profile-photo.component';

import { setCurrentUser } from '../../redux/user/user.actions';
import {
  updateProfilePhotoStart,
  clearProfilePhotoStatuses,
} from '../../redux/post/post.actions';

it('renders an update-password component', () => {
  const updateProfilePhotoWrapper = shallow(
    <UpdateProfilePhoto
      updateProfilePhotoStart={(formData) => updateProfilePhotoStart(formData)}
      currentUser={null}
      setCurrentUser={(user) => setCurrentUser(user)}
      updateProfilePhotoConfirm={null}
      updateProfilePhotoError={null}
      profilePhotoKey={null}
      clearProfilePhotoStatuses={() => clearProfilePhotoStatuses()}
    />
  );

  expect(updateProfilePhotoWrapper).toMatchSnapshot();
});
