import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';
import { PostFileReq, UserType } from '../../redux/post/post.types';
import {
  selectProfilePhotoKey,
  selectProfilePhotoFile,
} from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import './header.styles.scss';

interface HeaderProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: string | null;
  getPostFileStart: typeof getPostFileStart;
  signOutStart: typeof signOutStart;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  profilePhotoKey,
  profilePhotoFile,
  getPostFileStart,
  signOutStart,
}) => {
  const [photoFile, setPhotoFile] = useState<string | null>(null);

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (profilePhotoKey) {
      getPostFileStart({
        s3Key: profilePhotoKey,
        bucket,
        user: UserType.self,
      });
    } else if (!profilePhotoFile && currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket,
        user: UserType.self,
      });
    }
  }, [profilePhotoKey, currentUser]);

  useEffect(() => {
    if (profilePhotoFile) {
      setPhotoFile(profilePhotoFile);
    }
  }, [profilePhotoFile]);

  return (
    <div className='header'>
      <NavLink className='app-name' to='/'>
        <h1 className='title'>PhotoShare</h1>
      </NavLink>
      {currentUser ? (
        <div>
          <NavLink to={`/${currentUser.username}`} className='avatar'>
            {photoFile ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${photoFile}`}
                alt='profile-pic'
              />
            ) : null}
            {!photoFile ? (
              <div className='photo-placeholder'>
                <span className='photo-placeholder-text'>No photo</span>
              </div>
            ) : null}
          </NavLink>
          <nav className='header-menu'>
            <NavLink className='link' to='/settings'>
              Settings
            </NavLink>
            <NavLink className='link' to='/' onClick={signOutStart}>
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
  profilePhotoFile: string | null;
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
