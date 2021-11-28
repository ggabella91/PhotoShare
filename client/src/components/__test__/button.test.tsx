import { render, screen, fireEvent } from '../../test-utils/test-utils';
import Button from '../button/button.component';

describe('button component tests', () => {
  const setup = () => {
    const clickHandler = jest.fn();

    const buttonRenderResult = render(
      <Button className='button-class' onClick={clickHandler} />
    );

    return { buttonRenderResult, clickHandler };
  };

  it('renders a button component', () => {
    const {
      buttonRenderResult: { container: button },
    } = setup();

    expect(button).toBeInTheDocument();
  });

  it('clicking button calls click handler', () => {
    const { clickHandler } = setup();

    const button = screen.getByTestId('button');

    fireEvent.click(button);

    expect(clickHandler).toBeCalled();
  });
});
