import { render, screen } from '../../test-utils/test-utils';

import '../not-found/not-found-page.component';
import NotFoundPage from '../not-found/not-found-page.component';

describe('not-found page component tests', () => {
  const setup = () => {
    render(<NotFoundPage />);
  };

  it('renders a not-found page component', () => {
    setup();

    const notFoundPage = screen.getByText("Sorry, this page isn't available.");

    expect(notFoundPage).toBeInTheDocument();
  });
});
