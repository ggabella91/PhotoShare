import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { User } from '../../redux/user/user.types';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { signOutStart } from '../../redux/user/user.actions';
import { PostFile, PostFileReq } from '../../redux/post/post.types';
import { selectProfilePhotoFile } from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import './header.styles.scss';

interface HeaderProps {
  currentUser: User | null;
  profilePhotoFile: string | null;
  getPostFileStart: typeof getPostFileStart;
  signOutStart: typeof signOutStart;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  profilePhotoFile,
  getPostFileStart,
  signOutStart,
}) => {
  const [photoFile, setPhotoFile] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.photo) {
      getPostFileStart({
        s3Key: currentUser.photo,
        bucket: 'photo-share-app-profile-photos',
      });
    }
  }, [currentUser]);

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
          <div className='avatar'>
            {photoFile ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${photoFile}`}
                alt='profile-pic'
              />
            ) : null}
          </div>
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
  profilePhotoFile: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  profilePhotoFile: selectProfilePhotoFile,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPostFileStart: ({ s3Key, bucket }: PostFileReq) =>
    dispatch(getPostFileStart({ s3Key, bucket })),
  signOutStart: () => dispatch(signOutStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
