import React, { useState } from 'react';

import './search-bar.styles.scss';

export interface SearchBarProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => {};
  name: string;
  type: string;
  value: string;
  label: string;
}

interface SuggestionsData {
  profilePhotoFileString: string;
  username: string;
  name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  children,
  onSubmit,
  label,
  ...otherProps
}) => {
  const [suggestionsArray, setSuggestionsArray] = useState<SuggestionsData[]>(
    []
  );

  const handleRenderSuggestions = () => {
    suggestionsArray.map((el) => <div></div>);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='group'>
        {label ? (
          <label
            className={`${
              otherProps.value.length ? 'hide' : ''
            } search-bar-label`}
          >
            {label}
          </label>
        ) : null}
        <input className='search-bar' {...otherProps} />
      </div>
    </form>
  );
};

export default SearchBar;
