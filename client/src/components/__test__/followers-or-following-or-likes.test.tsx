import { render, screen } from '../../test-utils/test-utils';

import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  getPostFileStart,
  clearFollowPhotoFileArray,
} from '../../redux/post/post.actions';

import { FollowersOrFollowingOrLikesModal } from '../followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

describe('followers-following-or-likes-modal component tests', () => {
  const setup = (isFollowersModal: boolean, isPostLikingUsersModal?: boolean) =>
    render(
      <FollowersOrFollowingOrLikesModal
        users={[]}
        show={true}
        onHide={() => {}}
        isFollowersModal={isFollowersModal}
        followers={[]}
        following={[]}
        usersProfilePhotoConfirm=''
        getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
        getPostFileStart={(postFileReq) => getPostFileStart(postFileReq)}
        followPhotoFileArray={[]}
        clearFollowPhotoFileArray={() => clearFollowPhotoFileArray()}
        isPostLikingUsersModal={isPostLikingUsersModal}
      />
    );

  it('renders a followers modal', () => {
    setup(true);

    const followersOrFollowingModal = screen.getByTestId(
      'followers-following-or-likes-modal'
    );

    expect(followersOrFollowingModal).toBeInTheDocument();
    expect(screen.queryByText(/Followers/)).not.toBeNull();
  });

  it('renders a following modal', () => {
    setup(false);

    const followersOrFollowingModal = screen.getByTestId(
      'followers-following-or-likes-modal'
    );

    expect(followersOrFollowingModal).toBeInTheDocument();
    expect(screen.queryByText(/Following/)).not.toBeNull();
  });

  it('renders a likes modal', () => {
    setup(false, true);

    expect(screen.queryByText(/Likes/)).not.toBeNull();
  });
});
