import { Button, Grid, Typography } from '@mui/material';
import React, { MutableRefObject } from 'react';

import './form-input.styles.scss';

export interface FormInputProps {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  value: string;
  label: string;
  tall?: boolean;
  modal?: boolean;
  onFocus?: () => void;
  onBlur?: (event: React.FocusEvent) => void;
}

export interface FormFileInputType {
  onChange: React.ChangeEventHandler;
  name: string;
  type: string;
  label: string;
  accept: string;
  key: number;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  fileName: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  tall,
  ...otherProps
}) => (
  <div className='group'>
    {label ? (
      <label
        className={`${otherProps.value.length ? 'hide' : ''} form-input-label`}
        htmlFor='form-input'
      >
        {label}
      </label>
    ) : null}
    <input id='form-input' className='form-input' {...otherProps} />
  </div>
);

export const ExpandableFormInput: React.FC<FormInputProps> = ({
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
        htmlFor='expandable-form-input'
      >
        {label}
      </label>
    ) : null}
    <textarea
      id='expandable-form-input'
      className={`${modal ? 'modal ' : ''}form-input comment`}
      {...otherProps}
    />
  </div>
);

export const FormFileInput: React.FC<FormFileInputType> = ({
  label,
  inputRef,
  fileName,
  ...otherProps
}) => (
  <div className='group'>
    <Grid sx={{ display: 'flex' }}>
      <Button
        variant='contained'
        sx={{
          // width: '100%',
          // minWidth: 'unset',
          height: '100%',
          textTransform: 'capitalize',
          padding: 0,
          '&:hover': {
            backgroundColor: 'unset',
          },
        }}
        disableRipple
      >
        <Typography>{label}</Typography>
        <input
          id='file-input'
          className='form-file-input'
          {...otherProps}
          style={{ display: 'none' }}
          ref={inputRef}
        />
      </Button>
      <Typography>{fileName}</Typography>
    </Grid>
  </div>
);
