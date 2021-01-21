import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AppState } from '../../redux/root-reducer';

import { User, Error } from '../../redux/user/user.types';
import {
  selectUserSuggestions,
  selectUserSuggestionsError,
} from '../../redux/user/user.selectors';
import { getUserSuggestionsStart } from '../../redux/user/user.actions';

import { PostFile, PostFileReq } from '../../redux/post/post.types';
import {} from '../../redux/post/post.selectors';
import { getPostFileStart } from '../../redux/post/post.actions';

import UserSuggestions from '../user-suggestions/user-suggestions.component';

import './search-bar.styles.scss';

export interface SearchBarProps {
  userSuggestions: User[];
  userSuggestionsError: Error | null;
  getUserSuggestionsStart: typeof getUserSuggestionsStart;
  getPostFileStart: typeof getPostFileStart;
}

export interface UserSuggestionsData {
  profilePhotoFileString: string;
  username: string;
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  getUserSuggestionsStart,
  userSuggestions,
  userSuggestionsError,
}) => {
  const [searchString, setSearchString] = useState('');
  const [userSuggestionsArray, setUserSuggestionsArray] = useState<
    UserSuggestionsData[]
  >([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);

  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

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
    if (userSuggestions) {
      const suggested: UserSuggestionsData[] = userSuggestions.map(
        (el: User) => {
          return {
            name: el.name,
            username: el.username,
            profilePhotoFileString: '',
          };
        }
      );

      setUserSuggestionsArray(suggested);
    }
  }, [userSuggestions]);

  useEffect(() => {
    if (userSuggestionsArray.length) {
      setShowUserSuggestions(true);
    } else {
      setShowUserSuggestions(false);
    }
  }, [userSuggestionsArray]);

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
        />
        <UserSuggestions
          userSuggestionsArray={userSuggestionsArray}
          show={showUserSuggestions}
        />
      </div>
    </form>
  );
};

interface LinkStateProps {
  userSuggestions: User[];
  userSuggestionsError: Error | null;
}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({
  userSuggestions: selectUserSuggestions,
  userSuggestionsError: selectUserSuggestionsError,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserSuggestionsStart: (match: string) =>
    dispatch(getUserSuggestionsStart(match)),
  getPostFileStart: (fileReq: PostFileReq) =>
    dispatch(getPostFileStart(fileReq)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
