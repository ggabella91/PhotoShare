import { shallow } from 'enzyme';
import React from 'react';
import { Router, Route } from 'react-router-dom';
import { ResetPasswordPage } from '../reset-password/reset-password-page.component';

import { resetPasswordStart } from '../../redux/user/user.actions';

// export const renderWithRouterMatch = (
//   ui: React.FC,
//   {
//     path = '/',
//     route = '/',
//     history = createMemoryHistory({ initialEntries: [route] }),
//   } = {}
// ) => {
//   return (
//     <Router history={history}>
//       <Route path={path} component={ui} />
//     </Router>
//   );
// };

it('renders a reset password page component', () => {
  // const resetPasswordPageWrapper = shallow(
  //   <ResetPasswordPage
  //     resetPasswordStart={(resetRequest) => resetPasswordStart(resetRequest)}
  //     resetConfirm={null}
  //     resetError={null}
  //   />
  // );
  // expect(resetPasswordPageWrapper).toMatchSnapshot();
});
