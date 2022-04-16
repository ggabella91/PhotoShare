import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from './redux/user/user.selectors';

interface WithAuthProps {
  children: React.ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);

  return <>{currentUser ? children : <Navigate to='/' />}</>;
};

export default WithAuth;
