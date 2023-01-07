import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';
import {
  PostFile,
  FileRequestType,
  PostFileReq,
  UserType,
} from '../../redux/post/post.types';
import {
  selectProfilePhotoKey,
  selectProfilePhotoFile,
} from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchBar from '../search-bar/search-bar.component';

import './header.styles.scss';
import { Button, Grid, Popover } from '@mui/material';
import NotificationsContainer from './notifications-container.component';

interface HeaderProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
  getPostFileStart: typeof getPostFileStart;
  signOutStart: typeof signOutStart;
}

// TODO: Fetch initial batch of notifications within this component, when rendered

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  getPostFileStart,
  signOutStart,
}) => {
  const [photoFileString, setPhotoFileString] = useState<string>('');
  const [searchBarKey, setSearchBarKey] = useState(Math.random());
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsButtonRef = useRef<HTMLButtonElement | null>(null);

  const params = useParams();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => setSearchBarKey(Math.random()), [params]);

  useEffect(() => {
    if (currentUser && profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!profilePhotoFile && currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket,
        user: UserType.self,
        fileRequestType: FileRequestType.singlePost,
      });
    } else if (!currentUser && photoFileString.length) {
      setPhotoFileString('');
    }
  }, [profilePhotoKey, currentUser]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setPhotoFileString(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  const handleClickNotificationsButton = () =>
    setOpenNotifications(!openNotifications);

  const handleCloseNotifications = () => setOpenNotifications(false);

  return (
    <div className='header' data-testid='header'>
      <NavLink className='app-name' to='/' data-testid='app-logo-link'>
        <h1 className='title'>PhotoShare</h1>
      </NavLink>
      {currentUser ? (
        <div>
          <SearchBar key={searchBarKey} />
          <NavLink
            to={`/${currentUser.username}`}
            className='avatar'
            data-testid='profile-page-link'
          >
            {photoFileString.length ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${photoFileString}`}
                alt='profile-pic'
              />
            ) : null}
            {!photoFileString.length ? (
              <div className='photo-placeholder'>
                <span className='photo-placeholder-text'>No photo</span>
              </div>
            ) : null}
          </NavLink>
          <nav className='header-menu'>
            <Button
              onClick={handleClickNotificationsButton}
              sx={{
                '&:hover': {
                  backgroundColor: 'unset',
                },
              }}
              ref={notificationsButtonRef}
            >
              <NotificationsIcon sx={{ color: 'white', marginRight: '5px' }} />
            </Button>
            {notificationsButtonRef.current && (
              <Popover
                open={openNotifications}
                anchorEl={notificationsButtonRef.current}
                onClose={handleCloseNotifications}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                sx={{ transform: 'translateY(60px)' }}
              >
                <Grid
                  sx={{ display: 'flex', width: '200px', minHeight: '60px' }}
                >
                  <NotificationsContainer />
                </Grid>
              </Popover>
            )}
            <NavLink className='link' to='/post' data-testid='create-post-link'>
              Post Image
            </NavLink>
            <NavLink
              className='link'
              to='/video-post'
              data-testid='create-video-post-link'
            >
              Post Video
            </NavLink>
            <NavLink
              className='link'
              to='/direct/inbox'
              data-testid='messages-link'
            >
              Messages
            </NavLink>
            <NavLink
              className='link'
              to='/settings'
              data-testid='settings-link'
            >
              Settings
            </NavLink>
            <NavLink
              className='link'
              to='/'
              onClick={signOutStart}
              data-testid='sign-out-link'
            >
              Sign Out
            </NavLink>
          </nav>
        </div>
      ) : null}
    </div>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  profilePhotoKey: selectProfilePhotoKey,
  profilePhotoFile: selectProfilePhotoFile,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  signOutStart: () => dispatch(signOutStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
