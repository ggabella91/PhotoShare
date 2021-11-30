import { render, screen, fireEvent } from '../../test-utils/test-utils';
import { Header } from '../header/header.component';
import { User } from '../../redux/user/user.types';
import { PostFile } from '../../redux/post/post.types';

describe('header component tests', () => {
  const getPostFileStart = jest.fn();
  const signOutStart = jest.fn();
  const testUser = { username: 'test-dude' } as User;
  const testPostFile = {} as PostFile;

  const setup = () =>
    render(
      <Header
        currentUser={testUser}
        profilePhotoFile={testPostFile}
        profilePhotoKey='photo-key'
        getPostFileStart={getPostFileStart}
        signOutStart={signOutStart}
      />
    );

  it('renders a header component', () => {
    setup();

    const header = screen.getByTestId('header');

    expect(header).toBeInTheDocument();
  });

  it("clicking profile avatar causes navigation to current user's profile page", () => {
    setup();

    const profilePageAvatarLink = screen.getByTestId('profile-page-link');

    fireEvent.click(profilePageAvatarLink);

    expect(window.location.pathname).toEqual('/test-dude');
  });

  it('clicking new post link causes navigation to create-post page', () => {
    setup();

    const createPostLink = screen.getByRole('link', { name: 'New Post' });

    fireEvent.click(createPostLink);

    expect(window.location.pathname).toEqual('/post');
  });

  it('clicking settings link causes navigation to settings page', () => {
    setup();

    const settingsLink = screen.getByRole('link', { name: 'Settings' });

    fireEvent.click(settingsLink);

    expect(window.location.pathname).toEqual('/settings');
  });
});
