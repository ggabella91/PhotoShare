import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from './redux/root-reducer';
import { User } from './redux/user/user.types';
import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession } from './redux/user/user.actions';

import './App.scss';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import SignUpAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-sign-up.component';
import FeedPage from './pages/feed-page/feed-page.component';
import PostPage from './pages/post-page/post-page.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from './pages/settings-page/settings-page.component';
import MyProfilePage from './pages/my-profile/my-profile-page.component';
import UserProfilePage from './pages/user-profile-page/user-profile-page.component';
import ForgotPasswordPage from './pages/forgot-password/forgot-password-page.component';
import ResetPasswordPage from './pages/reset-password/reset-password-page.component';

interface AppProps {
  checkUserSession: typeof checkUserSession;
  currentUser: User | null;
}

export const App: React.FC<AppProps> = ({ checkUserSession, currentUser }) => {
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
          render={() => (!currentUser ? <Redirect to='/' /> : <FeedPage />)}
        />
        <Route
          exact
          path='/post'
          render={() => (!currentUser ? <Redirect to='/' /> : <PostPage />)}
        />
        <Route
          exact
          path='/settings'
          render={() => (!currentUser ? <Redirect to='/' /> : <SettingsPage />)}
        />
        <Route
          exact
          path='/forgot-password'
          render={() => <ForgotPasswordPage />}
        />
        <Route
          path='/reset-password/:token'
          render={() => <ResetPasswordPage />}
        />
        <Route
          exact
          path='/'
          render={() =>
            currentUser ? <Redirect to='/me' /> : <SignUpAndSignUpPage />
          }
        />
        <Route
          path='/:username'
          render={({ match }) => {
            if (currentUser && match.params.username === currentUser.username) {
              return <MyProfilePage />;
            } else if (currentUser) {
              return <UserProfilePage username={match.params.username} />;
            } else {
              return <Redirect to='/' />;
            }
          }}
        />
      </Switch>
      <Footer />
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
