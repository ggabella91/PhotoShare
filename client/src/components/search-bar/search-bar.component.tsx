import React from 'react';

import './search-bar.styles.scss';

export interface SearchBarProps {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  children,
  label,
  ...otherProps
}) => {
  return (
    <div className='search-bar-group'>
      <label
        className={`${otherProps.value.length ? 'hide' : ''} search-bar-label`}
      >
        {label}
      </label>
      <input className='search-bar' {...otherProps} />
    </div>
  );
};

export default SearchBar;
