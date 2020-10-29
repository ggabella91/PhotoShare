import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector, Selector } from 'reselect';

import { AppState } from './redux/root-reducer';
import { User } from './redux/user/user.types';
import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession } from './redux/user/user.actions';
import axios from 'axios';

import './App.scss';
import Header from './components/header/header.component';

interface AppProps {
  // For when createStructuredSelector includes a selection
  // that depends on the app's props
}

const App: React.FC<AppProps> = () => {
  return (
    <div className='App'>
      <Header />
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
  checkUserSession: () => dispatch(checkUserSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
