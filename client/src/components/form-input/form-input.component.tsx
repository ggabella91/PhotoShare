import React from 'react';

import './form-input.styles.scss';

export interface FormInputProps {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
}

export interface FormFileInputType {
  onChange: React.ChangeEventHandler;
  ref: React.MutableRefObject<HTMLInputElement | null>;
  id: string;
  name: string;
  type: string;
  label: string;
  accept: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  children,
  label,
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
