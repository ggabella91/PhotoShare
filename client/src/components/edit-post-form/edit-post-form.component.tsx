import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createStructuredSelector } from 'reselect';

import { AppState } from '../../redux/root-reducer';

import {
  Post,
  EditPostDetailsReq,
  PostError,
} from '../../redux/post/post.types';
import {
  setShowPostEditForm,
  editPostDetailsStart,
} from '../../redux/post/post.actions';

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

  useEffect(() => {
    if (editCaption || editLocation) {
      setEditPostDetails({ caption: editCaption, location: editLocation });
    }
  });

  const { caption, location } = editPostDetails;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setEditPostDetails({ ...editPostDetails, [name]: value });
  };

  const handleEditPostFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    editPostDetailsStart({
      postId,
      caption: editCaption,
      location: editLocation,
    });
    setShowPostEditForm(false);
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
      />
      <div className='buttons-container'>
        <button
          className='edit-post-button'
          onClick={() => handleEditPostFormSubmit}
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
  editPostDetailsStart: (editPostDetailsReq: EditPostDetailsReq) =>
    dispatch(editPostDetailsStart(editPostDetailsReq)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditPostForm);
