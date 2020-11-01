import React, { ChangeEvent } from 'react';

import './form-input.styles.scss';

export interface FormInputProps {
  onChange?: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ children, ...otherProps }) => (
  <div className='group'>
    <input className='form-input' {...otherProps} />
    <label className='form-input-label' />
  </div>
);

export default FormInput;
