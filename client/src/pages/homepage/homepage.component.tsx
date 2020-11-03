import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import './homepage.styles.scss';

interface HomePageProps {
  currentUser?: typeof selectCurrentUser;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, []);

  return (
    <div className='homepage'>
      <div>
        <h2>Welcome, {name.split(' ')[0]}!</h2>
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
