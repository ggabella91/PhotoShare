import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

import UserSuggestion from '../user-suggestion/user-suggestion.component';

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

  let history = useHistory();

  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    setSearchString(value);
  };

  useEffect(() => {
    if (searchString.length >= 3) {
      console.log(searchString);
      getUserSuggestionsStart(searchString);
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

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {};

  const handleRenderSuggestions = () => {
    if (userSuggestionsArray.length) {
      return (
        <ul className='user-suggestions-dropdown'>
          {userSuggestionsArray.map((el: UserSuggestionsData, idx: number) => (
            <UserSuggestion
              key={idx}
              username={el.username}
              onClick={history.push(`${el.username}`)}
            />
          ))}
        </ul>
      );
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
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
      </div>
      {handleRenderSuggestions}
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
