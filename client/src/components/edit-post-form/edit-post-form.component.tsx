import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import { setShowPostEditForm } from '../../redux/post/post.actions';

import './edit-post-form.styles.scss';

interface EditPostFormProps {
  editCaption: string;
  editLocation: string;
  setShowPostEditForm: typeof setShowPostEditForm;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  editCaption,
  editLocation,
  setShowPostEditForm,
}) => {
  const [editPostDetails, setEditPostDetails] = useState({
    caption: '',
    location: '',
  });

  useEffect(() => {
    if (editCaption && editLocation) {
      setEditPostDetails({ caption: editCaption, location: editLocation });
    }
  });

  const { caption, location } = editPostDetails;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setEditPostDetails({ ...editPostDetails, [name]: value });
  };

  return (
    <form
      className='edit-post-form'
      onSubmit={() => {
        /* Add action creator and other refux logic for submitting edit-post request*/
      }}
    >
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
      />
      <div className='buttons-container'>
        <button
          className='edit-post-button'
          onClick={() => {
            /*Add action creator and other redux for submitting edit-post request*/
          }}
        >
          Done Editing
        </button>
        <button
          className='cancel-edit-button'
          onClick={() => setShowPostEditForm(false)}
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
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPostForm);
