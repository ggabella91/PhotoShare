import React from 'react';

import './form-input.styles.scss';

export interface FormInputProps {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
  tall?: boolean;
  modal?: boolean;
}

export interface FormFileInputType {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  label: string;
  accept: string;
  key: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  children,
  label,
  tall,
  ...otherProps
}) => (
  <div className='group'>
    {label ? (
      <label
        className={`${otherProps.value.length ? 'hide' : ''} form-input-label`}
      >
        {label}
      </label>
    ) : null}
    <input className='form-input' {...otherProps} />
  </div>
);

export const ExpandableFormInput: React.FC<FormInputProps> = ({
  children,
  label,
  tall,
  modal,
  ...otherProps
}) => (
  <div className='group comment'>
    {label ? (
      <label
        className={`${
          otherProps.value.length ? 'hide' : ''
        } comment-form-input-label`}
      >
        {label}
      </label>
    ) : null}
    <textarea
      className={`${modal ? 'modal ' : ''}form-input comment`}
      {...otherProps}
    />
  </div>
);

export const FormFileInput: React.FC<FormFileInputType> = ({
  children,
  label,
  ...otherProps
}) => (
  <div className='group'>
    <label className='form-file-input-label'>{label}</label>
    <input className='form-file-input' {...otherProps} />
  </div>
);
