import { render, screen } from '../test-utils/test-utils';
import { App } from '../App';

import { checkUserSession } from '../redux/user/user.actions';

global.setImmediate =
  global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));

describe('Main app component tests', () => {
  const setup = () => {
    render(
      <App checkUserSession={() => checkUserSession()} currentUser={null} />
    );
  };

  it('renders app component', () => {
    setup();

    const app = screen.getByTestId('main-app-component');

    expect(app).toBeInTheDocument();
  });
});
