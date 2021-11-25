import { render } from '../../test-utils/test-utils';
import Button from '../button/button.component';

it('renders a button component', () => {
  const { container: button } = render(
    <Button className='button-class' onClick={() => {}} />
  );

  expect(button).toBeInTheDocument();
});
