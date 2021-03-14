import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';

import { User, Error } from '../../redux/user/user.types';
import {
  selectUserSuggestions,
  selectUserSuggestionsConfirm,
  selectUserSuggestionsError,
} from '../../redux/user/user.selectors';
import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import { PostFile, PostFileReq, UserType } from '../../redux/post/post.types';
import {
  selectUsersProfilePhotoFileArray,
  selectUsersProfilePhotoConfirm,
} from '../../redux/post/post.selectors';
import {
  getPostFileStart,
  clearUsersPhotoFileArray,
} from '../../redux/post/post.actions';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './search-bar.styles.scss';

export interface SearchBarProps {
  userSuggestions: User[] | null;
  userSuggestionsConfirm: string | null;
  userSuggestionsError: Error | null;
  userSuggestionProfilePhotoFiles: PostFile[] | null;
  userSuggestionProfilePhotoConfirm: string | null;
  getUserSuggestionsStart: typeof getUserSuggestionsStart;
  getPostFileStart: typeof getPostFileStart;
  clearUserSuggestions: typeof clearUserSuggestions;
  clearUserSuggestionPhotoFiles: typeof clearUsersPhotoFileArray;
}

export interface UserInfoData {
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  getUserSuggestionsStart,
  getPostFileStart,
  userSuggestions,
  userSuggestionsConfirm,
  userSuggestionsError,
  userSuggestionProfilePhotoFiles,
  userSuggestionProfilePhotoConfirm,
  clearUserSuggestions,
  clearUserSuggestionPhotoFiles,
}) => {
  const [searchString, setSearchString] = useState('');
  const [userSuggestionsArray, setUserSuggestionsArray] = useState<
    UserInfoData[]
  >([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [hideSuggestionsOnBlur, setHideSuggestionsOnBlur] = useState(false);

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    clearUserSuggestions();
    clearUserSuggestionPhotoFiles();
    setUserSuggestionsArray([]);
    setSearchString(value);
  };

  useEffect(() => {
    if (searchString.length >= 3) {
      getUserSuggestionsStart(searchString);
    } else {
      setShowUserSuggestions(false);
    }
  }, [searchString]);

  useEffect(() => {
    if (
      userSuggestions &&
      !userSuggestionProfilePhotoFiles &&
      !userSuggestionProfilePhotoConfirm
    ) {
      for (let user of userSuggestions) {
        if (user.photo) {
          getPostFileStart({
            user: UserType.usersArray,
            bucket,
            s3Key: user.photo,
          });
        }
      }
    } else if (
      userSuggestions &&
      userSuggestionProfilePhotoFiles &&
      userSuggestionProfilePhotoFiles.length
    ) {
      const suggestedUser: UserInfoData[] = userSuggestions.map((el: User) => {
        let photoFileString: string;

        for (let file of userSuggestionProfilePhotoFiles) {
          if (el.photo === file.s3Key) {
            photoFileString = file.fileString;
          }
        }

        return {
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: photoFileString!,
          location: '',
        };
      });

      setUserSuggestionsArray(suggestedUser);
    } else if (
      userSuggestions &&
      !userSuggestionProfilePhotoFiles &&
      userSuggestionProfilePhotoConfirm
    ) {
      const suggestedUser: UserInfoData[] = userSuggestions.map((el: User) => {
        return {
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: '',
          location: '',
        };
      });

      setUserSuggestionsArray(suggestedUser);
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

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setTimeout(() => {
        clearUserSuggestionPhotoFiles();
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
          onFocus={(e) => setHideSuggestionsOnBlur(false)}
          onBlur={(e) => handleBlur(e)}
        />
        {!showUserSuggestions || hideSuggestionsOnBlur ? null : (
          <UserInfo
            userInfoArray={userSuggestionsArray}
            styleType={StyleType.suggestion}
          />
        )}
        {!userSuggestionsArray.length && userSuggestionsConfirm ? (
          <div className='no-matches'>
            <span className='no-matches-text'>No matches found</span>
          </div>
        ) : null}
      </div>
    </form>
  );
};

interface LinkStateProps {
  userSuggestions: User[] | null;
  userSuggestionsConfirm: string | null;
  userSuggestionsError: Error | null;
  userSuggestionProfilePhotoFiles: PostFile[] | null;
  userSuggestionProfilePhotoConfirm: string | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  userSuggestions: selectUserSuggestions,
  userSuggestionsConfirm: selectUserSuggestionsConfirm,
  userSuggestionsError: selectUserSuggestionsError,
  userSuggestionProfilePhotoFiles: selectUsersProfilePhotoFileArray,
  userSuggestionProfilePhotoConfirm: selectUsersProfilePhotoConfirm,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserSuggestionsStart: (match: string) =>
    dispatch(getUserSuggestionsStart(match)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
  clearUserSuggestions: () => dispatch(clearUserSuggestions()),
  clearUserSuggestionPhotoFiles: () => dispatch(clearUsersPhotoFileArray()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
