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
}) => {
  const handleButtonClick = () => inputRef?.current?.click();

  return (
    <div className='group'>
      <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant='contained'
          sx={{
            width: '100%',
            height: '100%',
            textTransform: 'capitalize',
            backgroundColor: '#074aaf',
            padding: '5px',
            marginBottom: '10px',
            '&:hover': {
              backgroundColor: '#074aaf',
            },
          }}
          onClick={handleButtonClick}
          disableRipple
        >
          <Typography>{label}</Typography>
        </Button>
        <input
          id='file-input'
          className='form-file-input'
          style={{ display: 'none' }}
          ref={inputRef}
          data-testid='file-input'
          {...otherProps}
        />
        <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '250px',
            padding: '5px 0px',
            wordBreak: 'normal',
          }}
        >
          {fileName || 'No File Selected'}
        </Typography>
      </Grid>
    </div>
  );
};
