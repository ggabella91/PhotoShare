import React from 'react';

import './edit-post-form.styles.scss';

interface EditPostFormProps {
  editCaption: string;
  editLocation: string;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  editCaption,
  editLocation,
}) => {
  return (
    <form
      className=''
      onSubmit={() => {
        /* Add action creator and other refux logic for submitting edit-post request*/
      }}
    >
      <input
        type='text'
        name='editCaption'
        value={editCaption}
        placeholder='Add a caption'
      />
      <input
        type='text'
        name='editLocation'
        value={editLocation}
        placeholder='Where was this taken?'
      />
      <div>
        <button
          className='edit-post-button'
          onClick={() => {
            /*Add action creator and other redux for submitting edit-post request*/
          }}
        />
        <button
          className='cancel-edit-button'
          onClick={() => {
            /*Set show edit-post form to false */
          }}
        />
      </div>
    </form>
  );
};

export default EditPostForm;
