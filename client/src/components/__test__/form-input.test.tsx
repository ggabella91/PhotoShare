import { shallow } from 'enzyme';
import React from 'react';
import { FormInput, FormFileInput } from '../form-input/form-input.component';

it('renders a form input component', () => {
  const formInputWrapper = shallow(
    <FormInput
      onChange={() => {}}
      name='regular form'
      type='regular'
      value='form-value'
      label='test-form'
    />
  );

  expect(formInputWrapper).toMatchSnapshot();
});

it('renders a form file input component', () => {
  const formFileInputWrapper = shallow(
    <FormFileInput
      onChange={() => {}}
      name='file form'
      type='file'
      label='test-file-form'
      key={Date.now()}
      accept='images'
    />
  );

  expect(formFileInputWrapper).toMatchSnapshot();
});
