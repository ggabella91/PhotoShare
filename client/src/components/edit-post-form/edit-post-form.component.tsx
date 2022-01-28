import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import { EditPostDetailsReq, Location } from '../../redux/post/post.types';
import { selectLocationSelection } from '../../redux/post/post.selectors';
import {
  setShowPostEditForm,
  editPostDetailsStart,
  getLocationsSuggestionsStart,
  clearLocationsSuggestions,
} from '../../redux/post/post.actions';
import { useDebounce } from '../../pages/hooks';
import LocationsSuggestionsContainer, {
  StyleType,
} from '../locations-suggestions-container/locations-suggestions-container.component';

import './edit-post-form.styles.scss';

interface EditPostFormProps {
  postId: string;
  editCaption: string;
  editLocation: string;
  setShowPostEditForm: typeof setShowPostEditForm;
  editPostDetailsStart: typeof editPostDetailsStart;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  postId,
  editCaption,
  editLocation,
  setShowPostEditForm,
  editPostDetailsStart,
}) => {
  const [editPostDetails, setEditPostDetails] = useState({
    caption: '',
    location: '',
  });
  const [locationObj, setLocationObj] = useState<Location | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dispatch = useDispatch();
  const locationSelection = useSelector(selectLocationSelection);
  const { caption, location } = editPostDetails;

  const debouncedLocationSearchString = useDebounce(location, 1000);

  useEffect(() => {
    if (editCaption || editLocation) {
      setEditPostDetails({ caption: editCaption, location: editLocation });
    }
  }, []);

  useEffect(() => {
    if (
      debouncedLocationSearchString &&
      debouncedLocationSearchString.length >= 3 &&
      showSuggestions
    ) {
      dispatch(getLocationsSuggestionsStart(debouncedLocationSearchString));
    }
  }, [debouncedLocationSearchString]);

  useEffect(() => {
    if (locationSelection) {
      setLocationObj(locationSelection);
      setEditPostDetails({
        ...editPostDetails,
        location: locationSelection.label,
      });
      setShowSuggestions(false);
    }
  }, [locationSelection]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setEditPostDetails({ ...editPostDetails, [name]: value });
  };

  const handleEditPostFormSubmit = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    editPostDetailsStart({
      postId,
      caption,
      location: locationObj || ({} as Location),
    });
    setShowPostEditForm(false);
  };

  const handleCancelEdit = () => setShowPostEditForm(false);

  const handleFocus = () => setShowSuggestions(true);

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch(clearLocationsSuggestions());
      setShowSuggestions(false);
    }
  };

  return (
    <form className='edit-post-form' onSubmit={handleEditPostFormSubmit}>
      <input
        className='input'
        type='text'
        name='caption'
        value={caption}
        placeholder='Add a caption'
        onChange={handleInputChange}
      />
      <input
        className='input'
        type='text'
        name='location'
        value={location}
        placeholder='Where was this taken?'
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions ? (
        <LocationsSuggestionsContainer styleType={StyleType.editPost} />
      ) : null}
      <div className='buttons-container'>
        <button
          type='submit'
          className='edit-post-button'
          onClick={handleEditPostFormSubmit}
        >
          Done Editing
        </button>
        <button
          type='button'
          className='cancel-edit-button'
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

interface LinkStateProps {}

const mapStateToProps = createStructuredSelector<AppState, LinkStateProps>({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setShowPostEditForm: (showPostEditForm: boolean) =>
    dispatch(setShowPostEditForm(showPostEditForm)),
  editPostDetailsStart: (editPostDetailsReq: EditPostDetailsReq) =>
    dispatch(editPostDetailsStart(editPostDetailsReq)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPostForm);
