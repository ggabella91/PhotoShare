import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Location } from '../../redux/post/post.types';
import { selectLocationsSuggestions } from '../../redux/post/post.selectors';
import { setLocationSelection } from '../../redux/post/post.actions';

import './locations-suggestions-container.styles.scss';

export enum StyleType {
  createPost = 'create-post',
  editPost = 'edit-post',
}

interface LocationsSuggestionsContainerProps {
  styleType: StyleType;
  postPage?: boolean;
}

const LocationsSuggestionsContainer: React.FC<
  LocationsSuggestionsContainerProps
> = ({ styleType, postPage }) => {
  const dispatch = useDispatch();
  const locationsSuggestions = useSelector(selectLocationsSuggestions);

  const handleClickComponent = (event: React.MouseEvent<HTMLElement>) => {
    const divElement = event.currentTarget;
    const index = parseInt(divElement.dataset.idx || '0');

    const locationSelection = locationsSuggestions.find(
      (el, idx) => idx === index
    );

    if (locationSelection) {
      dispatch(setLocationSelection(locationSelection));
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const locationSuggestionsComponents = locationsSuggestions.map(
    (location: Location, idx: number) => (
      <div
        className={`${styleType}-locations-suggestion${
          postPage ? ' post-page' : ''
        }`}
        key={idx}
        data-idx={idx}
        data-testid={`location-element-${idx}`}
        onClick={handleClickComponent}
        onMouseDown={handleMouseDown}
      >
        <span className={`${styleType}-location-label`}>{location.label}</span>
      </div>
    )
  );

  return (
    <div
      className={`${styleType}-locations-suggestions-container${
        postPage ? ' post-page' : ''
      }`}
      data-testid='locations-suggestions-container'
    >
      {locationSuggestionsComponents}
    </div>
  );
};

export default LocationsSuggestionsContainer;
