import React from 'react';

import './post-tile.styles.scss';

type CustomRef = (node: HTMLDivElement | null) => void;

interface PostTileProps {
  fileString: string;
  onClick: () => void;
  custRef: CustomRef | null;
}

const PostTile: React.FC<PostTileProps> = ({
  fileString,
  custRef,
  ...props
}) => {
  return (
    <div className='post-tile' ref={custRef}>
      <img
        className='post-tile-image'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='post-pic'
        {...props}
      />
    </div>
  );
};

export default PostTile;
