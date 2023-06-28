import { render, screen, fireEvent } from '../../test-utils/test-utils';
import { Header } from '../header/header.component';

describe('header component tests', () => {
  const setup = () => render(<Header />);

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

    const createPostLink = screen.getByRole('link', { name: 'Post Image' });

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
