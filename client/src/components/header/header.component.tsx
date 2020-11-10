import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';

import './header.styles.scss';

interface HeaderProps {
  currentUser: User | null;
  signOutStart: typeof signOutStart;
}

const Header: React.FC<HeaderProps> = ({ currentUser, signOutStart }) => {
  return (
    <div className='header'>
      <NavLink className='app-name' to='/'>
        <h1 className='title'>PhotoShare</h1>
      </NavLink>
      {currentUser ? (
        <nav className='header-menu'>
          <NavLink className='link' to='/settings'>
            Settings
          </NavLink>
          <NavLink className='link' to='/' onClick={signOutStart}>
            Sign Out
          </NavLink>
        </nav>
      ) : null}
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signOutStart: () => dispatch(signOutStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
