import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

import './messages-page.styles.scss';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = useState();
  const location = useLocation();

  console.log('window location host: ', window.location.host);

  const socket = io(`https://${window.location.host}`, {
    path: '/api/messages/chat',
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connection established with messages server');

      socket.emit('joinRoom', 1);
    });
  }, [socket]);

  return <div className='messages-page'></div>;
};

export default MessagesPage;
