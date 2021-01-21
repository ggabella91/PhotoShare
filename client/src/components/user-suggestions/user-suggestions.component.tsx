import React from 'react';
import { useHistory } from 'react-router-dom';

import { UserSuggestionsData } from '../search-bar/search-bar.component';

import './user-suggestions.styles.scss';

interface UserSuggestionsProps {
  userSuggestionsArray: UserSuggestionsData[];
  show: boolean;
}

const UserSuggestions: React.FC<UserSuggestionsProps> = ({
  userSuggestionsArray,
}) => {
  let history = useHistory();
  const suggestions = userSuggestionsArray.map(
    (el: UserSuggestionsData, idx: number) => (
      <div
        className='user-suggestion'
        key={idx}
        onClick={() => {
          history.push(`/${el.username}`);
        }}
      >
        <div className='suggestion-avatar'>
          <div className='suggestion-photo-placeholder'>
            <span className='suggestion-photo-placeholder-text'>No photo</span>
          </div>
        </div>
        <div className='username-and-name'>
          <span className='username'>{el.username}</span>
        </div>
      </div>
    )
  );

  return <div className='user-suggestions-dropdown'>{suggestions}</div>;
};

export default UserSuggestions;
