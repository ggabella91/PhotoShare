import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import './messages-page.styles.scss';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = useState();
  const location = useLocation();

  const currentUser = useSelector(selectCurrentUser);

  const socket = useMemo(
    () =>
      io(`wss://${window.location.host}`, {
        path: '/api/messages/chat',
        // port: 80,
      }),
    []
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connection established with messages server');

      socket.emit('createConversation', {
        name: 'Test Convo',
        connectedUsers: [currentUser?.id],
      });
    });
  }, [socket]);

  return <div className='messages-page'></div>;
};

export default MessagesPage;
