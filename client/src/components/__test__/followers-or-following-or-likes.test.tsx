import { render } from '../../test-utils/test-utils';

import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  getPostFileStart,
  clearFollowPhotoFileArray,
} from '../../redux/post/post.actions';

import { FollowersOrFollowingOrLikesModal } from '../followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

it('renders a user-suggestions component', () => {
  const { container: followersOrFollowingModal } = render(
    <FollowersOrFollowingOrLikesModal
      users={[]}
      show={true}
      onHide={() => {}}
      isFollowersModal={true}
      followers={[]}
      following={[]}
      usersProfilePhotoConfirm=''
      getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
      getPostFileStart={(postFileReq) => getPostFileStart(postFileReq)}
      followPhotoFileArray={[]}
      clearFollowPhotoFileArray={() => clearFollowPhotoFileArray()}
    />
  );

  expect(followersOrFollowingModal).toBeInTheDocument();
});
