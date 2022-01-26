import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../hooks';
import MapBoxMap from '../../components/mapbox-map/mapbox-map.component';

import { OtherUserType } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import {
  Post,
  FileRequestType,
  PostFile,
  UserType,
} from '../../redux/post/post.types';
import {
  getPostsWithHashtagStart,
  getPostFileStart,
  clearPostState,
  setShowPostEditForm,
  archivePostStart,
  deleteReactionStart,
  setShowCommentOptionsModal,
  clearArchivePostStatuses,
} from '../../redux/post/post.actions';

import PostModal from '../../components/post-modal/post-modal.component';
import PostTile from '../../components/post-tile/post-tile.component';
import PostOrCommentOptionsModal from '../../components/post-or-comment-options-modal/post-or-comment-options-modal.component';
import FollowersOrFollowingOrLikesModal from '../../components/followers-or-following-or-likes-modal/followers-or-following-or-likes-modal.component';

import { PostModalMapProps } from '../my-profile/my-profile-page.component';
import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';
import { AppState } from '../../redux/root-reducer';

import './explore-location-page.styles.scss';

interface ExploreLocationPageProps {
  locationId: string;
  location: string;
}

const ExploreLocationPage: React.FC<ExploreLocationPageProps> = ({
  locationId,
  location,
}) => {
  
  console.log(location);

  return (
    <div className='explore-location-page'>
      <MapBoxMap />
    </div>
  );
};

export default ExploreLocationPage;
