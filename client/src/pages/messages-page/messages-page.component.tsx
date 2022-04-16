import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

import { selectCurrentUser } from '../../redux/user/user.selectors';

import { selectMessageUser } from '../../redux/message/message.selectors';
import {
  findOrCreateUserStart,
  removeUserSessionCookieStart,
  addToJoinedConversationsArray,
  addMessageToConversation,
} from '../../redux/message/message.actions';

import './messages-page.styles.scss';

const MessagesPage: React.FC = () => {
  const [message, setMessage] = useState();
  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);

  const location = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const messageUser = useSelector(selectMessageUser);

  const dispatch = useDispatch();

  const socket = useMemo(
    () =>
      io(`wss://${window.location.host}`, {
        path: '/api/messages/chat',
        port: 443,
        query: { userId: currentUser?.id || '' },
      }),
    []
  );

  useEffect(() => {
    // When component unmounts, such as when the user
    // signs out
    return () => {
      if (isSocketConnectionActive) {
        socket.emit('forceDisconnectClient');
      }
    };
  }, [socket, isSocketConnectionActive]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connection established with messages server');

      setIsSocketConnectionActive(true);

      if (currentUser) {
        dispatch(
          findOrCreateUserStart({
            userId: currentUser.id,
            name: currentUser.name,
          })
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from messages server');

      setIsSocketConnectionActive(false);
    });

    socket.on('joinedConversation', (conversation) => {
      dispatch(addToJoinedConversationsArray(conversation));
    });

    socket.on('joinedConversations', (conversations) => {
      dispatch(addToJoinedConversationsArray(conversations));
    });

    socket.on('chatToClient', (message) => {
      dispatch(addMessageToConversation(message));
    });
  }, [socket]);

  useEffect(() => {
    if (!currentUser && messageUser && isSocketConnectionActive) {
      const { userId } = messageUser;

      dispatch(removeUserSessionCookieStart(userId));
    }
  }, [currentUser, messageUser, isSocketConnectionActive]);

  useEffect(() => {
    if (
      isSocketConnectionActive &&
      messageUser &&
      !joinedExistingConversations
    ) {
      socket.emit('joinAllExistingConversations', {
        userId: currentUser?.id,
      });

      setJoinedExistingConversations(true);

      socket.emit('createConversation', {
        name: 'Test Convo',
        connectedUsers: [currentUser?.id],
      });
    }
  }, [
    socket,
    currentUser?.id,
    messageUser,
    isSocketConnectionActive,
    joinedExistingConversations,
  ]);

  return (
    <div className='messages-page'>
      <h2>Messages</h2>
      <div className='messages-container'></div>
    </div>
  );
};

export default MessagesPage;
