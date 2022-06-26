import { useState, useRef, useCallback, useEffect } from 'react';
import { UserInfoData } from '../components/search-bar/search-bar.component';

import { List } from 'immutable';
import { useSelector, useDispatch } from 'react-redux';

import { User } from '../redux/user/user.types';

import { FileRequestType, UserType, Location } from '../redux/post/post.types';
import { selectSuggestionPhotoFileArray } from '../redux/post/post.selectors';
import { getPostFileStart } from '../redux/post/post.actions';

export const useLazyLoading = (isLoadingPostData: boolean) => {
  const [intersectionCounter, setIntersectionCounter] = useState(1);
  const [intersectionMap, setIntersectionMap] = useState<
    Record<string, IntersectionObserverEntry>
  >({});

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingPostData) return;

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

            setIntersectionCounter(
              (intersectionCounter) => intersectionCounter + 1
            );
          }
        },
        { threshold: 0.2 }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingPostData]
  );

  return { intersectionCounter, lastElementRef };
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
  }, [usersList]);

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
