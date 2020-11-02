import React, { ChangeEvent } from 'react';

import './form-input.styles.scss';

export interface FormInputProps {
  onChange?: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({
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

export default FormInput;
