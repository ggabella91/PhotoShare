import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  selectMapBoxAccessToken,
  selectPostLocationCoordinates,
} from '../../redux/post/post.selectors';

import './mapbox-map.styles.scss';

const MapBoxMap: React.FC = () => {
  const mapBoxAccessToken = useSelector(selectMapBoxAccessToken);
  const postLocationCoordinates = useSelector(selectPostLocationCoordinates);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [lat] = useState(postLocationCoordinates?.latitude || null);
  const [lng] = useState(postLocationCoordinates?.longitude || null);

  useEffect(() => {
    if (mapBoxAccessToken) {
      mapboxgl.accessToken = mapBoxAccessToken!;
    }
  }, [mapBoxAccessToken]);

  useEffect(() => {
    if (mapboxgl.accessToken && lat && lng) {
      if (map.current) {
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current as HTMLElement,
        style: 'mapbox://styles/ggabella91/ckyrj84lx0o9g14thr0bl3vba',
        center: [lng, lat],
        zoom: 9,
        attributionControl: false,
      }).addControl(new mapboxgl.AttributionControl({ compact: true }));

      new mapboxgl.Marker({
        color: '#015987',
        scale: 0.5,
      })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }
  }, [mapBoxAccessToken, lat, lng]);

  return (
    <div>
      <div ref={mapContainer} className='map-container'></div>
    </div>
  );
};

export default MapBoxMap;
