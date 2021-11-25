import { render } from '../test-utils/test-utils';
import { App } from '../App';

import { checkUserSession } from '../redux/user/user.actions';

it('renders app component', () => {
  const { container: app } = render(
    <App checkUserSession={() => checkUserSession()} currentUser={null} />
  );

  expect(app).toBeInTheDocument();
});
