import { render } from '../../test-utils/test-utils';

import '../not-found/not-found-page.component';
import NotFoundPage from '../not-found/not-found-page.component';

it('renders a not-found page component', () => {
  const { container: notFoundPageWrapper } = render(<NotFoundPage />);

  expect(notFoundPageWrapper).toBeInTheDocument();
});
