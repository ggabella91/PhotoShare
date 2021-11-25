import { render } from '../../test-utils/test-utils';

import { UpdateProfilePhoto } from '../update-profile-photo/update-profile-photo.component';

import { changeInfoStart } from '../../redux/user/user.actions';
import {
  updateProfilePhotoStart,
  clearProfilePhotoStatuses,
} from '../../redux/post/post.actions';

it('renders an update-password component', () => {
  const { container: updateProfilePhoto } = render(
    <UpdateProfilePhoto
      updateProfilePhotoStart={(formData) => updateProfilePhotoStart(formData)}
      currentUser={null}
      changeInfoStart={(fieldsToUpdate) => changeInfoStart(fieldsToUpdate)}
      updateProfilePhotoConfirm={null}
      updateProfilePhotoError={null}
      profilePhotoKey={null}
      clearProfilePhotoStatuses={() => clearProfilePhotoStatuses()}
    />
  );

  expect(updateProfilePhoto).toBeInTheDocument();
});
