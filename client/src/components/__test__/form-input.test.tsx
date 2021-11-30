import {
  render,
  screen,
  fireEvent,
  userEvent,
} from '../../test-utils/test-utils';
import {
  FormInput,
  FormFileInput,
  ExpandableFormInput,
} from '../form-input/form-input.component';

const changeHandler = jest.fn();

describe('form input component tests', () => {
  const setup = () =>
    render(
      <FormInput
        onChange={changeHandler}
        name='regular form'
        type='regular'
        value='form-value'
        label='test-form-input'
      />
    );

  it('renders a form-input component', () => {
    setup();

    const formInput = screen.getByLabelText('test-form-input');

    expect(formInput).toBeInTheDocument();
  });

  it('changing input text fires change handler', () => {
    setup();

    const formInput = screen.getByLabelText('test-form-input');

    userEvent.type(formInput, 'new input value');

    expect(changeHandler).toBeCalled();
  });
});

describe('form file input component tests', () => {
  const setup = () =>
    render(
      <FormFileInput
        onChange={changeHandler}
        name='file form'
        type='file'
        label='test-form-file-input'
        key={Date.now()}
        accept='images'
      />
    );

  it('renders a form file input component', () => {
    setup();

    const formFileInput = screen.getByLabelText('test-form-file-input');

    expect(formFileInput).toBeInTheDocument();
  });

  it('changing input file fires change handler', () => {
    setup();

    const formFileInput = screen.getByLabelText('test-form-file-input');

    fireEvent.change(formFileInput);

    expect(changeHandler).toBeCalled();
  });
});

describe('expandable form input component tests', () => {
  const setup = () =>
    render(
      <ExpandableFormInput
        onChange={changeHandler}
        name='expandable form'
        type='textarea'
        value='expandable-form-value'
        label='expandable-form-input'
      />
    );

  it('renders an expandable form input component', () => {
    setup();

    const expandableFormInput = screen.getByLabelText('expandable-form-input');

    expect(expandableFormInput).toBeInTheDocument();
  });

  it('changing input text fires change handler', () => {
    setup();

    const expandableFormInput = screen.getByLabelText('expandable-form-input');

    userEvent.type(expandableFormInput, 'new comment value');

    expect(changeHandler).toBeCalled();
  });
});
