import React, { useState, useEffect } from 'react';

import { User } from '../../redux/user/user.types';

import UserSuggestion from '../user-suggestion/user-suggestion.component';

import './search-bar.styles.scss';

export interface SearchBarProps {}

interface UserSuggestionsData {
  profilePhotoFileString: string;
  username: string;
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const [searchString, setSearchString] = useState('');
  const [userSuggestionsArray, setUserSuggestionsArray] = useState<
    UserSuggestionsData[]
  >([]);

  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;

    setSearchString(value);
  };

  useEffect(() => {
    if (searchString.length >= 3) {
      console.log(searchString);
    }
  });

  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {};

  const handleRenderSuggestions = () => {
    return (
      <div className='user-suggestions-element'>
        {userSuggestionsArray.map((el: UserSuggestionsData) => (
          <UserSuggestion />
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <div className='group'>
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

export default SearchBar;
