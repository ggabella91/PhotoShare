import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from './redux/root-reducer';
import { User } from './redux/user/user.types';
import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession } from './redux/user/user.actions';

import { selectMapBoxAccessToken } from './redux/post/post.selectors';
import { getMapBoxAccessTokenStart } from './redux/post/post.actions';

import './App.scss';

import WithAuth from './withAuth';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import SignUpAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-sign-up.component';
import FeedPage from './pages/feed-page/feed-page.component';
import CreatePostPage from './pages/create-post-page/create-post-page.component';
import PostPage from './pages/post-page/post-page.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from './pages/settings-page/settings-page.component';
import ProfilePageRoutes from './pages/profilePageRoutes';
import ForgotPasswordPage from './pages/forgot-password/forgot-password-page.component';
import ResetPasswordPage from './pages/reset-password/reset-password-page.component';
import ExploreTagPage from './pages/explore-tag-page/explore-tag-page.component';
import ExploreLocationPage from './pages/explore-location-page/explore-location-page.component';
import CreateVideoPostPage from './pages/create-video-post-page/create-video-post-page.component';
import MessagesPage from './pages/messages-page/messages-page.component';

interface AppProps {
  checkUserSession: typeof checkUserSession;
  currentUser: User | null;
}

export const App: React.FC<AppProps> = ({ checkUserSession, currentUser }) => {
  const mapBoxAccessToken = useSelector(selectMapBoxAccessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    checkUserSession();
  }, []);

  useEffect(() => {
    if (currentUser && !mapBoxAccessToken) {
      dispatch(getMapBoxAccessTokenStart());
    }
  }, [currentUser]);

  return (
    <div className='App' data-testid='main-app-component'>
      <Header />
      <Switch>
        <Route exact path='/forgot-password'>
          <ForgotPasswordPage />
        </Route>
        <Route path='/reset-password/:token'>
          <ResetPasswordPage />
        </Route>
        <Route exact path='/'>
          {currentUser ? <FeedPage /> : <SignUpAndSignUpPage />}
        </Route>
        <Route exact path='/direct/inbox'>
          <WithAuth>
            <MessagesPage />
          </WithAuth>
        </Route>
        <Route exact path='/post'>
          <WithAuth>
            <CreatePostPage />
          </WithAuth>
        </Route>
        <Route exact path='/video-post'>
          <WithAuth>
            <CreateVideoPostPage />
          </WithAuth>
        </Route>
        <Route exact path='/settings'>
          <WithAuth>
            <SettingsPage />
          </WithAuth>
        </Route>
        <Route path='/p/:postId'>
          <WithAuth>
            <PostPage />
          </WithAuth>
        </Route>
        <Route path='/explore/locations/:locationId/:location'>
          <WithAuth>
            <ExploreLocationPage />
          </WithAuth>
        </Route>
        <Route path='/explore/tags/:hashtag'>
          <WithAuth>
            <ExploreTagPage />
          </WithAuth>
        </Route>
        <Route path='/:username'>
          <WithAuth>
            <ProfilePageRoutes />
          </WithAuth>
        </Route>
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
