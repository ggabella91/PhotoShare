import { render, screen } from '../test-utils/test-utils';
import { App } from '../App';

import { checkUserSession } from '../redux/user/user.actions';

// TODO Find a way to mock '!mapbox-gl' module -- issue to ! operator,
// used to avoid mapbox transpilation issue with babel

// describe('Main app component tests', () => {
//   const setup = () => {
//     render(
//       <App checkUserSession={() => checkUserSession()} currentUser={null} />
//     );
//   };

//   it('renders app component', () => {
//     setup();

//     const app = screen.getByTestId('main-app-component');

//     expect(app).toBeInTheDocument();
//   });
// });
