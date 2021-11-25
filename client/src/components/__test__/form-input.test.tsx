import { render } from '../../test-utils/test-utils';
import { FormInput, FormFileInput } from '../form-input/form-input.component';

it('renders a form input component', () => {
  const { container: formInput } = render(
    <FormInput
      onChange={() => {}}
      name='regular form'
      type='regular'
      value='form-value'
      label='test-form'
    />
  );

  expect(formInput).toBeInTheDocument();
});

it('renders a form file input component', () => {
  const { container: formFileInput } = render(
    <FormFileInput
      onChange={() => {}}
      name='file form'
      type='file'
      label='test-file-form'
      key={Date.now()}
      accept='images'
    />
  );

  expect(formFileInput).toBeInTheDocument();
});
