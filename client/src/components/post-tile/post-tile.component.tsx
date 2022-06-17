import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentIcon from '@mui/icons-material/ModeComment';

import './post-tile.styles.scss';

type CustomRef = (node: HTMLDivElement | null) => void;

interface PostTileProps {
  fileString: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  custRef: CustomRef | null;
  id: string;
  dataS3Key: string;
  postLikesCount: number;
  postCommentsCount: number;
}

const PostTile: React.FC<PostTileProps> = ({
  fileString,
  custRef,
  id,
  dataS3Key,
  postLikesCount,
  postCommentsCount,
  onClick,
}) => {
  return (
    <div className='post-tile' id={id} ref={custRef}>
      <img
        className='post-tile-image'
        src={`data:image/jpeg;base64,${fileString}`}
        alt='post-pic'
      />
      <div
        className='image-overlay'
        data-testid='image-overlay'
        data-s3key={dataS3Key}
        onClick={onClick}
      >
        <ul className='likes-and-comments'>
          <li className='item-container'>
            <span className='item-count'>{postLikesCount}</span>
            <FavoriteIcon className='item-icon' />
          </li>
          <li className='item-container'>
            <span className='item-count'>{postCommentsCount}</span>
            <ModeCommentIcon className='item-icon' />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostTile;
