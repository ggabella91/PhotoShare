import { render, screen } from '../../test-utils/test-utils';
import Footer from '../footer/footer.component';

it('renders a footer component', () => {
  render(<Footer />);

  const footer = screen.getByTestId('footer');

  expect(footer).toBeInTheDocument();
});
