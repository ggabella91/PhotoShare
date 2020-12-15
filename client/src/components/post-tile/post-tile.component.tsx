import React from 'react';

import './post-tile.styles.scss';

interface PostTileProps {
  fileString: string;
  onClick: () => void;
}

const PostTile: React.FC<PostTileProps> = ({ fileString }) => {
  return (
    <div className='post-tile'>
      <img
        className='post-tile-image'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='post-pic'
      />
    </div>
  );
};

export default PostTile;
