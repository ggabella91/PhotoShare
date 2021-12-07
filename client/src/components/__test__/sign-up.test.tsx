import { render, screen, userEvent } from '../../test-utils/test-utils';

import { SignUp } from '../sign-up/sign-up.component';

describe('sign-up component tests', () => {
  const setup = () => {
    const signUpStart = jest.fn();

    render(<SignUp signUpStart={signUpStart} signUpError={null} />);

    return { signUpStart };
  };

  it('renders sign-up component', () => {
    setup();

    const signUp = screen.getByText(/Don't have an account yet?/i);

    expect(signUp).toBeInTheDocument();
  });

  it('clicking sign up button calls sign-up handler', () => {
    const { signUpStart } = setup();

    const signUpButton = screen.getByTestId('button');

    userEvent.click(signUpButton);

    expect(signUpStart).toBeCalled();
  });
});
