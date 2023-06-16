import { render, screen, userEvent } from '../../test-utils/test-utils';

import { SignIn } from '../sign-in/sign-in.component';

describe('sign-in component tests', () => {
  const setup = () => {
    const signInStart = jest.fn();

    render(<SignIn signInStart={signInStart} />);

    return { signInStart };
  };

  it('renders sign-in component', () => {
    setup();

    const signIn = screen.getByText(/Existing user?/i);

    expect(signIn).toBeInTheDocument();
  });

  it('Clicking sign in calls sign-in handler', () => {
    const { signInStart } = setup();

    const signInButton = screen.getByTestId('button');

    userEvent.click(signInButton);

    expect(signInStart).toBeCalled();
  });
});
