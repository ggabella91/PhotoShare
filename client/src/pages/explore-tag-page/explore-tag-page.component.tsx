import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { List, Map } from 'immutable';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { useLazyLoading } from '../hooks';

import './explore-tag-page.styles.scss';

interface ExploreTagPageProps {
  hashtag: string;
}

const ExploreTagPage: React.FC<ExploreTagPageProps> = ({ hashtag }) => {
  return <div></div>;
};

export default ExploreTagPage;
