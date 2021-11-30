import { render, screen, userEvent } from '../../test-utils/test-utils';
import CustomModal from '../modal/modal.component';

describe('custom modal component tests', () => {
  const setup = () => {
    const handleHide = jest.fn();
    const handleSubmit = jest.fn();

    render(
      <CustomModal
        header='header-text'
        subheader='subheader-text'
        bodytext='body-text'
        show={true}
        onHide={handleHide}
        onSubmit={handleSubmit}
        actionlabel='action-label'
      />
    );

    return { handleHide, handleSubmit };
  };

  it('renders a custom modal component', () => {
    setup();

    const customModal = screen.getByRole('document');

    expect(customModal).toBeInTheDocument();
  });

  it('clicking hide button calls hide handler function', () => {
    const { handleHide } = setup();

    const cancelButton = screen.getByTestId('cancel-button');

    userEvent.click(cancelButton);

    expect(handleHide).toBeCalled();
  });

  it('clicking submit button calls submit handler function', () => {
    const { handleSubmit } = setup();

    const submitButton = screen.getByTestId('submit-button');

    userEvent.click(submitButton);

    expect(handleSubmit).toBeCalled();
  });
});
