import { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from './redux/user/user.selectors';

interface WithAuthProps {
  children: React.ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const params = useParams<Record<string, string>>();

  useEffect(() => {
    console.log('params: ', params);
  }, [params]);

  return <>{currentUser ? children : <Redirect to='/' />}</>;
};

export default WithAuth;
