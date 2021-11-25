import { render } from '../../test-utils/test-utils';
import Footer from '../footer/footer.component';

it('renders a footer component', () => {
  const { container: footer } = render(<Footer />);

  expect(footer).toBeInTheDocument();
});
