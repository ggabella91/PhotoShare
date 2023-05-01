import React, { useState, useEffect, useMemo } from 'react';
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
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
import RootPathRoutes from './pages/rootPathRoutes';
import ProfilePageRoutes from './pages/profilePageRoutes';
import CreatePostPage from './pages/create-post-page/create-post-page.component';
import PostPage from './pages/post-page/post-page.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from './pages/settings-page/settings-page.component';
import ForgotPasswordPage from './pages/forgot-password/forgot-password-page.component';
import ResetPasswordPage from './pages/reset-password/reset-password-page.component';
import ExploreTagPage from './pages/explore-tag-page/explore-tag-page.component';
import ExploreLocationPage from './pages/explore-location-page/explore-location-page.component';
import CreateVideoPostPage from './pages/create-video-post-page/create-video-post-page.component';
import MessagesPage from './pages/messages-page/messages-page.component';
import { io } from 'socket.io-client';
import { findOrCreateUserStart } from './redux/message/message.actions';

interface AppProps {
  checkUserSession: typeof checkUserSession;
  currentUser: User | null;
}

const defaultState = {
  loading: true,
};

export const App: React.FC<AppProps> = ({ checkUserSession, currentUser }) => {
  const [loading, setLoading] = useState(defaultState.loading);
  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const mapBoxAccessToken = useSelector(selectMapBoxAccessToken);
  const dispatch = useDispatch();

  const socket = useMemo(
    () =>
      io(`wss://${window.location.host}`, {
        path: '/api/messages/chat',
        port: 443,
        query: { userId: currentUser?.id || '' },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketConnectionActive(true);

      if (currentUser) {
        dispatch(
          findOrCreateUserStart({
            userId: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            photoS3Key: currentUser.photo,
          })
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from messages server');

      setIsSocketConnectionActive(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

  useEffect(() => {
    // When component unmounts, such as when the user
    // signs out
    return () => {
      if (isSocketConnectionActive) {
        socket.emit('forceDisconnectClient');
      }
    };
  }, [socket, isSocketConnectionActive]);

  useEffect(() => {
    checkUserSession();
    setLoading(false);
  }, [checkUserSession]);

  useEffect(() => {
    if (currentUser && !mapBoxAccessToken) {
      dispatch(getMapBoxAccessTokenStart());
    }
  }, [dispatch, currentUser, mapBoxAccessToken]);

  return (
    <div
      className='App'
      data-testid='main-app-component'
      style={{ visibility: loading ? 'hidden' : 'visible' }}
    >
      <Routes>
        <Route
          path='/'
          element={
            <>
              <Header />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route
            path='/reset-password/:token'
            element={<ResetPasswordPage />}
          />
          <Route path='/' element={<RootPathRoutes />} />
          <Route
            element={
              <WithAuth>
                <Outlet />
              </WithAuth>
            }
          >
            <Route path='/direct'>
              <Route index element={<Navigate to='/direct/inbox' replace />} />
              <Route
                path='inbox'
                element={
                  <MessagesPage
                    socket={socket}
                    isSocketConnectionActive={isSocketConnectionActive}
                  />
                }
              />
              <Route
                path='t/:conversationId'
                element={
                  <MessagesPage
                    socket={socket}
                    isSocketConnectionActive={isSocketConnectionActive}
                  />
                }
              />
              <Route
                path='new'
                element={
                  <MessagesPage
                    socket={socket}
                    isSocketConnectionActive={isSocketConnectionActive}
                    openNewConvoModal
                  />
                }
              />
            </Route>
            <Route path='/post' element={<CreatePostPage />} />
            <Route path='/video-post' element={<CreateVideoPostPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='/p/:postId' element={<PostPage />} />
            <Route
              path='/explore/locations/:locationId/:location'
              element={<ExploreLocationPage />}
            />
            <Route path='/explore/tags/:hashtag' element={<ExploreTagPage />} />
            <Route path='/:username' element={<ProfilePageRoutes />} />
          </Route>
        </Route>
      </Routes>
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
