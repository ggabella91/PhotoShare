import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { User } from '../../redux/user/user.types';
import {
  selectUserSuggestions,
  selectUserSuggestionsConfirm,
} from '../../redux/user/user.selectors';
import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import {
  FileRequestType,
  UserType,
  Location,
} from '../../redux/post/post.types';
import { selectSuggestionPhotoFileArray } from '../../redux/post/post.selectors';
import {
  getPostFileStart,
  clearSuggestionPhotoFileArray,
} from '../../redux/post/post.actions';

import UserInfo, { StyleType } from '../user-info/user-info.component';

import './search-bar.styles.scss';

export interface UserInfoData {
  id?: string;
  profilePhotoFileString: string;
  username: string;
  name: string;
  photo: string | null;
  location: Location;
  comment: string;
}

export const SearchBar: React.FC = () => {
  const [searchString, setSearchString] = useState('');
  const [userSuggestionsArray, setUserSuggestionsArray] = useState<
    UserInfoData[]
  >([]);

  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [hideSuggestionsOnBlur, setHideSuggestionsOnBlur] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(
    null
  );
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [noProfilePhotosToFetch, setNoProfilePhotosToFetch] = useState(false);

  const userSuggestions = useSelector(selectUserSuggestions);
  const userSuggestionsConfirm = useSelector(selectUserSuggestionsConfirm);
  const userSuggestionProfilePhotoFiles = useSelector(
    selectSuggestionPhotoFileArray
  );

  const dispatch = useDispatch();

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useCallback(() => {
    dispatch(clearUserSuggestions());
    setUserSuggestionsArray([]);
    dispatch(clearSuggestionPhotoFileArray());
  }, [dispatch]);

  useEffect(() => {
    if (searchString.length >= 3) {
      dispatch(getUserSuggestionsStart(searchString));
    } else {
      setShowUserSuggestions(false);
    }
  }, [dispatch, searchString]);

  useEffect(() => {
    if (userSuggestions && userSuggestions.length) {
      let count = 0;

      for (let user of userSuggestions) {
        if (user.photo) {
          count++;
          dispatch(
            getPostFileStart({
              user: UserType.suggestionArray,
              bucket,
              s3Key: user.photo,
              fileRequestType: FileRequestType.singlePost,
            })
          );
        }
      }

      if (count === 0) {
        setNoProfilePhotosToFetch(true);
      }
    }
  }, [bucket, dispatch, userSuggestions]);

  useEffect(() => {
    if (userSuggestions && userSuggestionProfilePhotoFiles?.length) {
      const userSuggestionsArray = [...userSuggestions];

      const suggestedUsers: UserInfoData[] = userSuggestionsArray.map(
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
            location: {} as Location,
            comment: '',
          };
        }
      );

      setUserSuggestionsArray(suggestedUsers);
    } else if (userSuggestions && noProfilePhotosToFetch) {
      const userSuggestionsArray = [...userSuggestions];

      const suggestedUsers: UserInfoData[] = userSuggestionsArray.map(
        (el: User) => ({
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: '',
          location: {} as Location,
          comment: '',
        })
      );

      setUserSuggestionsArray(suggestedUsers);
    }
  }, [
    userSuggestions,
    userSuggestionProfilePhotoFiles,
    noProfilePhotosToFetch,
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

    setUserSuggestionsArray([]);
    setSearchString(value);
  };

  const handleFocus = () => setHideSuggestionsOnBlur(false);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHideSuggestionsOnBlur(true);
      setSelectedSuggestion(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (userSuggestionsArray.length) {
      if (event.key === 'ArrowUp') {
        if (selectedSuggestion === null) {
          setSelectedSuggestion(userSuggestionsArray.length - 1);
        } else {
          selectedSuggestion === 0
            ? setSelectedSuggestion(null)
            : setSelectedSuggestion(
                (selectedSuggestion) => selectedSuggestion! - 1
              );
        }
      } else if (event.key === 'ArrowDown') {
        if (selectedSuggestion === null) {
          setSelectedSuggestion(0);
        } else {
          selectedSuggestion === userSuggestionsArray.length - 1
            ? setSelectedSuggestion(null)
            : setSelectedSuggestion(
                (selectedSuggestion) => selectedSuggestion! + 1
              );
        }
      } else if (event.key === 'Enter') {
        setShouldNavigate(true);
      }
    }
  };

  return (
    <form data-testid='search-bar'>
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
          onKeyDown={handleKeyDown}
        />
        {!showUserSuggestions || hideSuggestionsOnBlur ? null : (
          <UserInfo
            userInfoArray={userSuggestionsArray}
            styleType={StyleType.suggestion}
            selectedSuggestion={selectedSuggestion}
            shouldNavigate={shouldNavigate}
          />
        )}
        {showUserSuggestions &&
        !userSuggestionsArray.length &&
        userSuggestionsConfirm ? (
          <div className='no-matches'>
            <span className='no-matches-text'>No matches found</span>
          </div>
        ) : null}
      </div>
    </form>
  );
};

export default SearchBar;
