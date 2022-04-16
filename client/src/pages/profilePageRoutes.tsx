import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../redux/user/user.selectors';

import MyProfilePage from './my-profile/my-profile-page.component';
import UserProfilePage from './user-profile-page/user-profile-page.component';

interface ProfilePageParams {
  username: string;
}

const ProfilePageRoutes: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { username } = useParams<ProfilePageParams>();

  return username === currentUser!.username ? (
    <MyProfilePage />
  ) : (
    <UserProfilePage username={username} />
  );
};

export default ProfilePageRoutes;
