import { render, screen, userEvent } from '../../test-utils/test-utils';

import { SignUp } from '../sign-up/sign-up.component';

describe('sign-up component tests', () => {
  const setup = () => {
    console.error = jest.fn();

    render(<SignUp />);
  };

  it('renders sign-up component', () => {
    setup();

    const signUp = screen.getByText(/Don't have an account yet?/i);

    expect(signUp).toBeInTheDocument();
  });

  it('clicking sign up button calls sign-up handler without throwing an error', () => {
    setup();

    const signUpButton = screen.getByTestId('button');

    userEvent.click(signUpButton);

    expect(console.error).not.toHaveBeenCalled();
  });
});
