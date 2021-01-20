import React from 'react';

import './user-suggestion.styles.scss';

interface UserSuggestionProps {
  key: number;
  onClick: void;
  username: string;
  name?: string;
  profilePhotoFileString?: string;
}

const UserSuggestion: React.FC<UserSuggestionProps> = ({
  username,
  ...otherProps
}) => {
  return (
    <div className='user-suggestion'>
      <div className='username-and-name'>
        <span>{username}</span>
      </div>
    </div>
  );
};

export default UserSuggestion;
