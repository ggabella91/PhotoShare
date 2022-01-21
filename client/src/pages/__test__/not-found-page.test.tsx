import { render, screen, userEvent } from '../../test-utils/test-utils';

import '../not-found/not-found-page.component';
import NotFoundPage from '../not-found/not-found-page.component';

describe('not-found page component tests', () => {
  const setup = () => {
    render(<NotFoundPage />, { route: '/non-existent-profile' });
  };

  it('renders a not-found page component', () => {
    setup();

    const notFoundPage = screen.getByText("Sorry, this page isn't available.");

    expect(notFoundPage).toBeInTheDocument();
  });

  it("clicking 'Go back to PhotoShare' takes user back to home page", () => {
    setup();

    expect(window.location.pathname).toEqual('/non-existent-profile');

    const backToPhotoShareLink = screen.getByText('Go back to PhotoShare.');

    userEvent.click(backToPhotoShareLink);

    expect(window.location.pathname).toEqual('/');
  });
});
