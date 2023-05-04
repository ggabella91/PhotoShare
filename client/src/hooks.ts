import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { UserInfoData } from './components/search-bar/search-bar.component';

import { List } from 'immutable';
import { useSelector, useDispatch } from 'react-redux';

import { User } from './redux/user/user.types';

import { FileRequestType, UserType, Location } from './redux/post/post.types';
import { selectSuggestionPhotoFileArray } from './redux/post/post.selectors';
import { getPostFileStart } from './redux/post/post.actions';
import { selectMessageUser } from './redux/message/message.selectors';
import { io } from 'socket.io-client';
import {
  addToJoinedConversationsArray,
  findOrCreateUserStart,
} from './redux/message/message.actions';

export const useLazyLoading = (
  isLoadingData: boolean,
  debounce?: boolean,
  debounceDelay?: number
) => {
  const [intersectionCounter, setIntersectionCounter] = useState(1);
  const [intersectionMap, setIntersectionMap] = useState<
    Record<string, IntersectionObserverEntry>
  >({});
  const [elementId, setElementId] = useState('');

  const observer = useRef<IntersectionObserver>();

  const observedElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingData) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          const foundElement = !!intersectionMap[entries[0].target.id];

          if (entries[0].isIntersecting && !foundElement) {
            setIntersectionMap({
              ...intersectionMap,
              [entries[0].target.id]: entries[0],
            });
            setElementId(entries[0].target.id);

            setIntersectionCounter(
              (intersectionCounter) => intersectionCounter + 1
            );
          }
        },
        { threshold: 0.2 }
      );

      if (node && debounce) {
        setTimeout(() => observer.current?.observe(node), debounceDelay);
      } else if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingData, intersectionMap, debounce, debounceDelay]
  );

  return { intersectionCounter, observedElementRef, elementId };
};

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useUserInfoData = (usersList: User[] | null) => {
  const [noProfilePhotosToFetch, setNoProfilePhotosToFetch] = useState(false);
  const [userSuggestionsList, setUserSuggestionsList] = useState<
    List<UserInfoData>
  >(List());
  const dispatch = useDispatch();

  const userSuggestionProfilePhotoFiles = useSelector(
    selectSuggestionPhotoFileArray
  );

  let bucket: string;

  if (process.env.NODE_ENV === 'production') {
    bucket = 'photo-share-app-profile-photos';
  } else {
    bucket = 'photo-share-app-profile-photos-dev';
  }

  useEffect(() => {
    if (usersList?.length) {
      let count = 0;

      for (let user of usersList) {
        if (user.photo) {
          count++;
          dispatch(
            getPostFileStart({
              user: UserType.suggestionArray,
              bucket,
              s3Key: user.photo,
              fileRequestType: FileRequestType.singlePost,
            })
          );
        }
      }

      if (count === 0) {
        setNoProfilePhotosToFetch(true);
      }
    } else {
      setUserSuggestionsList(List());
    }
  }, [dispatch, usersList, bucket]);

  useEffect(() => {
    if (usersList && userSuggestionProfilePhotoFiles?.length) {
      const userSuggestionsAsList = List(usersList);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => {
          let photoFileString: string;

          userSuggestionProfilePhotoFiles.forEach((file) => {
            if (el.photo === file.s3Key) {
              photoFileString = file.fileString;
            }
          });

          return {
            id: el.id,
            name: el.name,
            username: el.username,
            photo: el.photo || '',
            profilePhotoFileString: photoFileString!,
            location: {} as Location,
            comment: '',
          };
        }
      );

      setUserSuggestionsList(suggestedUser);
    } else if (usersList && noProfilePhotosToFetch) {
      const userSuggestionsAsList = List(usersList);

      const suggestedUser: List<UserInfoData> = userSuggestionsAsList.map(
        (el: User) => ({
          id: el.id,
          name: el.name,
          username: el.username,
          photo: el.photo || '',
          profilePhotoFileString: '',
          location: {} as Location,
          comment: '',
        })
      );

      setUserSuggestionsList(suggestedUser);
    }
  }, [usersList, userSuggestionProfilePhotoFiles, noProfilePhotosToFetch]);

  return userSuggestionsList;
};

export const useInitializeWebsocketConnection = (currentUser: User | null) => {
  const [isSocketConnectionActive, setIsSocketConnectionActive] =
    useState(false);
  const [joinedExistingConversations, setJoinedExistingConversations] =
    useState(false);
  const messageUser = useSelector(selectMessageUser);
  const dispatch = useDispatch();

  const socket = useMemo(
    () =>
      io(`wss://${window.location.host}`, {
        path: '/api/messages/chat',
        port: 443,
        query: { userId: currentUser?.id || '' },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    socket.on('connect', () => {
      setIsSocketConnectionActive(true);

      if (currentUser) {
        dispatch(
          findOrCreateUserStart({
            userId: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            photoS3Key: currentUser.photo,
          })
        );
      }
    });

    socket.on('joinedConversations', (conversations) => {
      dispatch(addToJoinedConversationsArray(conversations));
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected from messages server');

      setIsSocketConnectionActive(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

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
    }
  }, [
    socket,
    currentUser?.id,
    messageUser,
    isSocketConnectionActive,
    joinedExistingConversations,
  ]);

  useEffect(() => {
    // When component unmounts, such as when the user
    // signs out
    return () => {
      if (isSocketConnectionActive) {
        socket.emit('forceDisconnectClient');
      }
    };
  }, [socket, isSocketConnectionActive]);

  return { socket, isSocketConnectionActive };
};
