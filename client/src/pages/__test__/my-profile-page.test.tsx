import { render, screen } from '../../test-utils/test-utils';
import { MyProfilePage } from '../my-profile/my-profile-page.component';

describe('my-profile-page component tests', () => {
  const setup = () => {
    render(<MyProfilePage />);
  };

  it('renders a my-profile-page component', () => {
    setup();

    const myProfilePage = screen.getByTestId('my-profile-page');

    expect(myProfilePage).toBeInTheDocument();
  });
});
