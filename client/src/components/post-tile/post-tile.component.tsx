import React from 'react';

import './post-tile.styles.scss';

type CustomRef = (node: HTMLDivElement | null) => void;

interface PostTileProps {
  fileString: string;
  onClick: (event: React.MouseEvent<HTMLImageElement>) => void;
  custRef: CustomRef | null;
  dataS3Key: string;
}

const PostTile: React.FC<PostTileProps> = ({
  fileString,
  custRef,
  dataS3Key,
  ...props
}) => {
  return (
    <div className='post-tile' ref={custRef}>
      <img
        className='post-tile-image'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='post-pic'
        data-s3key={dataS3Key}
        {...props}
      />
    </div>
  );
};

export default PostTile;
