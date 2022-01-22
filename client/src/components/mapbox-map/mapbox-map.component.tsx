import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl, { Map } from 'mapbox-gl';

import { selectMapBoxAccessToken } from '../../redux/post/post.selectors';

import './mapbox-map.styles.scss';

const MapBoxMap: React.FC = () => {
  const mapBoxAccessToken = useSelector(selectMapBoxAccessToken);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);

  useEffect(() => {
    if (mapBoxAccessToken) {
      mapboxgl.accessToken = mapBoxAccessToken!;
    }
  }, [mapBoxAccessToken]);

  useEffect(() => {
    if (mapboxgl.accessToken) {
      console.log('mapboxgl.accessToken: ', mapboxgl.accessToken);
      if (map.current) {
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: 9,
      });
    }
  }, [mapBoxAccessToken]);

  return (
    <div>
      <div ref={mapContainer} className='map-container'></div>
    </div>
  );
};

export default MapBoxMap;
