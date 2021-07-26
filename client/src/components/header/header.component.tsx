import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
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

import SearchBar from '../search-bar/search-bar.component';

import './header.styles.scss';

interface HeaderProps {
  currentUser: User | null;
  profilePhotoKey: string | null;
  profilePhotoFile: PostFile | null;
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
  const [photoFileString, setPhotoFileString] = useState<string | null>(null);
  const [searchBarKey, setSearchBarKey] = useState(Math.random());

  const path = useParams();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => setSearchBarKey(Math.random()), [path]);

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
    } else if (!currentUser && photoFileString) {
      setPhotoFileString(null);
    }
  }, [profilePhotoKey, currentUser]);

  useEffect(() => {
    if (profilePhotoFile && profilePhotoFile.fileString) {
      setPhotoFileString(profilePhotoFile.fileString);
    }
  }, [profilePhotoFile]);

  return (
    <div className='header'>
      <NavLink className='app-name' to='/'>
        <h1 className='title'>PhotoShare</h1>
      </NavLink>
      {currentUser ? (
        <div>
          <SearchBar key={searchBarKey} />
          <NavLink to={`/${currentUser.username}`} className='avatar'>
            {photoFileString ? (
              <img
                className='profile-photo'
                src={`data:image/jpeg;base64,${photoFileString}`}
                alt='profile-pic'
              />
            ) : null}
            {!photoFileString ? (
              <div className='photo-placeholder'>
                <span className='photo-placeholder-text'>No photo</span>
              </div>
            ) : null}
          </NavLink>
          <nav className='header-menu'>
            <NavLink className='link' to='/post'>
              New Post
            </NavLink>
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
