import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../redux/user/user.selectors';

import FeedPage from './feed-page/feed-page.component';
import SignUpAndSignUpPage from './sign-in-and-sign-up/sign-in-sign-up.component';

const RootPathRoutes: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);

  return currentUser ? <FeedPage /> : <SignUpAndSignUpPage />;
};

export default RootPathRoutes;
