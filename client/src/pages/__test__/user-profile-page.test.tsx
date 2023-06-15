import { render, screen } from '../../test-utils/test-utils';
import { UserProfilePage } from '../user-profile-page/user-profile-page.component';

describe('user-profile-page component tests', () => {
  const setup = () => {
    render(<UserProfilePage username='giuliano_gabella' />);
  };

  it('renders a user-profile-page component', () => {
    setup();

    const userProfilePage = screen.getByTestId('user-profile-page');

    expect(userProfilePage).toBeInTheDocument();
  });
});
