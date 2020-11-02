import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';

interface HomePageProps {
  currentUser?: typeof selectCurrentUser;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
  return (
    <div className='homepage'>
      <div>
        <h2>Welcome to PhotoShare!</h2>
      </div>
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, null)(HomePage);
