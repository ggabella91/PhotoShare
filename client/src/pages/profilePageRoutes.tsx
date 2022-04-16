import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../redux/user/user.selectors';

import MyProfilePage from './my-profile/my-profile-page.component';
import UserProfilePage from './user-profile-page/user-profile-page.component';

const ProfilePageRoutes: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { username } = useParams();

  return username ? (
    username === currentUser!.username ? (
      <MyProfilePage />
    ) : (
      <UserProfilePage username={username} />
    )
  ) : null;
};

export default ProfilePageRoutes;
