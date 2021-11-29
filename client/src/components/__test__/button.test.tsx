import { render, screen, fireEvent } from '../../test-utils/test-utils';
import Button from '../button/button.component';

describe('button component tests', () => {
  const setup = () => {
    const clickHandler = jest.fn();

    render(<Button className='button-class' onClick={clickHandler} />);

    return clickHandler;
  };

  it('renders a button component', () => {
    setup();

    const button = screen.getByTestId('button');

    expect(button).toBeInTheDocument();
  });

  it('clicking button calls click handler', () => {
    const clickHandler = setup();

    const button = screen.getByTestId('button');

    fireEvent.click(button);

    expect(clickHandler).toBeCalled();
  });
});
