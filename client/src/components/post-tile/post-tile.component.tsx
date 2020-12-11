import React from 'react';

import './post-tile.styles.scss';

interface PostTileProps {
  postFile: string;
}

const PostTile: React.FC<PostTileProps> = (children) => {
  const { postFile } = children;

  return (
    <div className='post-tile'>
      <img
        className='post-image'
        src={`data:image/jpeg;base64,${postFile}`}
        alt='profile-pic'
      />
    </div>
  );
};

export default PostTile;
