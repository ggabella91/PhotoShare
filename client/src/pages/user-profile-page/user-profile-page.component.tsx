import React from 'react';
import { NavLink, RouteComponentProps, match } from 'react-router-dom';

import '../my-profile/profile-page.styles.scss';

interface UserProfilePageProps {
  username: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ username }) => {
  return (
    <div className='profile-page'>
      <h1>{username}</h1>
    </div>
  );
};

export default UserProfilePage;
