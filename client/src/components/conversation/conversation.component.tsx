import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import MessageComponent from './message.component';
import { useUserInfoData } from '../../pages/hooks';

import {
  selectJoinedConversations,
  selectConversationMessages,
} from '../../redux/message/message.selectors';

import {
  selectCurrentUser,
  selectConversationUsers,
} from '../../redux/user/user.selectors';
import { OtherUserType } from '../../redux/user/user.types';
import {
  getOtherUserStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';

import { clearSuggestionPhotoFileArray } from '../../redux/post/post.actions';
import { UserInfoData } from '../search-bar/search-bar.component';

interface ConversationProps {
  conversationId: string;
}

type UserInfoMap = Record<string, UserInfoData>;

const Conversation: React.FC<ConversationProps> = ({ conversationId }) => {
  const [userInfoMap, setUserInfoMap] = useState<UserInfoMap>({});

  const currentUser = useSelector(selectCurrentUser);
  const joinedConversations = useSelector(selectJoinedConversations);
  const conversationMessages = useSelector(selectConversationMessages);
  const conversationUsers = useSelector(selectConversationUsers);

  const usersInfoList = useUserInfoData(conversationUsers);

  const currentConveration = joinedConversations?.find(
    (conversation) => conversation._id === conversationId
  );
  const conversationMessageUsers = currentConveration?.connectedUsers;
  const currentConversationMessages = conversationMessages.filter(
    (convoMessage) => convoMessage.conversationId === conversationId
  );
  const messagesArray = currentConversationMessages[0].messages;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearUserSuggestions());
    dispatch(clearSuggestionPhotoFileArray());
  }, []);

  useEffect(() => {
    if (conversationMessageUsers?.length) {
      conversationMessageUsers.forEach((user) =>
        dispatch(
          getOtherUserStart({
            type: OtherUserType.CONVERSATION_USER,
            usernameOrId: user.userId,
          })
        )
      );
    }
  }, [conversationMessageUsers]);

  useEffect(() => {
    if (usersInfoList?.size) {
      const userInfoMap = usersInfoList.reduce<UserInfoMap>((acc, cur) => {
        acc[cur.id!] = cur;
        return acc;
      }, {});

      setUserInfoMap(userInfoMap);
    }
  }, [usersInfoList]);

  return (
    <Grid>
      {messagesArray.map((message) => (
        <MessageComponent
          userInfo={userInfoMap[message.userId]}
          message={message}
          isCurrentUser={message.userId === currentUser?.id}
          isGroupConversation={
            !!(conversationUsers && conversationUsers.length > 2)
          }
        />
      ))}
    </Grid>
  );
};

export default Conversation;
