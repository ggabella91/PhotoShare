import React, { useState } from 'react';

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
  );
};

export default SearchBar;
