import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';
import { List } from 'immutable';

import { User, Error } from '../../redux/user/user.types';
import {
  selectCurrentUser,
  selectUserSuggestions,
  selectUserSuggestionsConfirm,
  selectUserSuggestionsError,
} from '../../redux/user/user.selectors';
import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import {
  FileRequestType,
  PostFile,
  PostFileReq,
  UserType,
} from '../../redux/post/post.types';
import {
  selectSuggestionPhotoFileArray,
  selectUsersProfilePhotoConfirm,
} from '../../redux/post/post.selectors';
import {
  getPostFileStart,
  clearSuggestionPhotoFileArray,
} from '../../redux/post/post.actions';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './search-bar.styles.scss';

export interface SearchBarProps {
  key: number;
  currentUser: User | null;
  userSuggestions: User[] | null;
  userSuggestionsConfirm: string | null;
  userSuggestionsError: Error | null;
  userSuggestionProfilePhotoFiles: PostFile[] | null;
  userSuggestionProfilePhotoConfirm: string | null;
  getUserSuggestionsStart: typeof getUserSuggestionsStart;
  getPostFileStart: typeof getPostFileStart;
  clearUserSuggestions: typeof clearUserSuggestions;
  clearSuggestionPhotoFileArray: typeof clearSuggestionPhotoFileArray;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: string;
  comment: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  getUserSuggestionsStart,
  getPostFileStart,
  currentUser,
  userSuggestions,
  userSuggestionsConfirm,
  userSuggestionsError,
  userSuggestionProfilePhotoFiles,
  userSuggestionProfilePhotoConfirm,
  clearUserSuggestions,
  clearSuggestionPhotoFileArray,
}) => {
  const [searchString, setSearchString] = useState('');
  const [userSuggestionsList, setUserSuggestionsList] = useState<
    List<UserInfoData>
  >(List());

  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [hideSuggestionsOnBlur, setHideSuggestionsOnBlur] = useState(false);

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    clearUserSuggestions();
    setUserSuggestionsList(List());
    clearSuggestionPhotoFileArray();
  }, [currentUser]);

  useEffect(() => {
    if (searchString.length >= 3) {
      getUserSuggestionsStart(searchString);
    } else {
      setShowUserSuggestions(false);
    }
  }, [searchString]);

  useEffect(() => {
    if (userSuggestions && userSuggestions.length) {
      for (let user of userSuggestions) {
        if (user.photo) {
          getPostFileStart({
            user: UserType.suggestionArray,
            bucket,
            s3Key: user.photo,
            fileRequestType: FileRequestType.singlePost,
          });
        }
      }
    }
  }, [userSuggestions]);

  useEffect(() => {
    if (
      userSuggestions &&
      userSuggestionProfilePhotoFiles &&
      userSuggestionProfilePhotoFiles.length
    ) {
      const userSuggestionsAsList = List(userSuggestions);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => {
          let photoFileString: string;

          userSuggestionProfilePhotoFiles.forEach((file) => {
            if (el.photo === file.s3Key) {
              photoFileString = file.fileString;
            }
          });

          return {
            name: el.name,
            username: el.username,
            photo: el.photo || '',
            profilePhotoFileString: photoFileString!,
            location: '',
            comment: '',
          };
        }
      );

      setUserSuggestionsList(suggestedUser);
    } else if (
      userSuggestions &&
      !userSuggestionProfilePhotoFiles &&
      userSuggestionProfilePhotoConfirm
    ) {
      const userSuggestionsAsList = List(userSuggestions);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => ({
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: '',
          location: '',
          comment: '',
        })
      );

      setUserSuggestionsList(suggestedUser);
    }
  }, [
    userSuggestions,
    userSuggestionProfilePhotoFiles,
    userSuggestionProfilePhotoConfirm,
  ]);

  useEffect(() => {
    if (searchString.length) {
      setShowUserSuggestions(true);
    } else {
      setShowUserSuggestions(false);
    }
  }, [searchString.length]);

  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    setUserSuggestionsList(List());
    setSearchString(value);
  };

  const handleFocus = () => setHideSuggestionsOnBlur(false);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setTimeout(() => {
        setHideSuggestionsOnBlur(true);
      }, 150);
    }
  };

  return (
    <form>
      <div className='search-group'>
        <label
          className={`${searchString.length ? 'hide' : ''} search-bar-label`}
        >
          Search
        </label>
        <input
          onChange={handleSearchStringChange}
          className='search-bar'
          name='search'
          type='text'
          value={searchString}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!showUserSuggestions || hideSuggestionsOnBlur ? null : (
          <UserInfo
            userInfoList={userSuggestionsList}
            styleType={StyleType.suggestion}
          />
        )}
        {showUserSuggestions &&
        !userSuggestionsList.size &&
        userSuggestionsConfirm ? (
          <div className='no-matches'>
            <span className='no-matches-text'>No matches found</span>
          </div>
        ) : null}
      </div>
    </form>
  );
};

interface LinkStateProps {
  currentUser: User | null;
  userSuggestions: User[] | null;
  userSuggestionsConfirm: string | null;
  userSuggestionsError: Error | null;
  userSuggestionProfilePhotoFiles: PostFile[] | null;
  userSuggestionProfilePhotoConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  currentUser: selectCurrentUser,
  userSuggestions: selectUserSuggestions,
  userSuggestionsConfirm: selectUserSuggestionsConfirm,
  userSuggestionsError: selectUserSuggestionsError,
  userSuggestionProfilePhotoFiles: selectSuggestionPhotoFileArray,
  userSuggestionProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserSuggestionsStart: (match: string) =>
    dispatch(getUserSuggestionsStart(match)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  clearUserSuggestions: () => dispatch(clearUserSuggestions()),
  clearSuggestionPhotoFileArray: () =>
    dispatch(clearSuggestionPhotoFileArray()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
