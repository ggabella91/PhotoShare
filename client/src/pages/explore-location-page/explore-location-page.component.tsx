import React, { useState, useEffect } from 'react';

import MapBoxMap from '../../components/mapbox-map/mapbox-map.component';

import './explore-location-page.styles.scss';

interface ExploreLocationPageProps {
  location: string;
}

const ExploreLocationPage: React.FC<ExploreLocationPageProps> = ({
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
