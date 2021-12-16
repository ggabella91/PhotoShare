import { render, screen } from '../../test-utils/test-utils';
import { CreatePostPage } from '../create-post-page/create-post-page.component';

import { User } from '../../redux/user/user.types';

describe('create-post page component tests', () => {
  const setup = () => {
    const currentUser = {} as User;

    const createPostStart = jest.fn();
    const clearPostStatuses = jest.fn();
    const getUsersFollowingStart = jest.fn();

    render(
      <CreatePostPage
        currentUser={currentUser}
        createPostStart={createPostStart}
        postConfirm='confirm'
        postError={null}
        clearPostStatuses={clearPostStatuses}
        getUsersFollowingStart={getUsersFollowingStart}
      />
    );

    return { createPostStart, clearPostStatuses, getUsersFollowingStart };
  };

  it('renders a create-post page component', () => {
    setup();

    const createPostPage = screen.getByText('Create a New Post');

    expect(createPostPage).toBeInTheDocument();
  });
});
