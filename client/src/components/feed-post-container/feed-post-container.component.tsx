import React from 'react';

import './feed-post-container.styles.scss';

interface FeedPostContainerProps {}

const FeedPostContainer: React.FC<FeedPostContainerProps> = () => {
  return (
    <div className='feed-post-container'>
      <div className='profile-and-options'></div>
      <div className='post-photo'></div>
      <div className='likes-and-comments'></div>
    </div>
  );
};

export default FeedPostContainer;
