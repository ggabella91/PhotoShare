import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from './redux/root-reducer';
import { User, UserPayload } from './redux/user/user.types';
import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession } from './redux/user/user.actions';

import './App.scss';
import Header from './components/header/header.component';
import SignUpAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-sign-up.component';
import HomePage from './pages/homepage/homepage.component';
import 'bootstrap/dist/css/bootstrap.min.css';

interface AppProps {
  checkUserSession: typeof checkUserSession;
  currentUser: UserPayload;
}

const App: React.FC<AppProps> = ({ checkUserSession, currentUser }) => {
  useEffect(() => {
    checkUserSession();
  }, []);

  return (
    <div className='App'>
      <Header />
      <Switch>
        <Route
          exact
          path='/me'
          render={() => (!currentUser ? <Redirect to='/' /> : <HomePage />)}
        />
        <Route
          exact
          path='/'
          render={() =>
            currentUser ? <Redirect to='/me' /> : <SignUpAndSignUpPage />
          }
        />
      </Switch>
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
