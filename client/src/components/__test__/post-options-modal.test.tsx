import { render, screen, userEvent } from '../../test-utils/test-utils';
import PostOptionsModal from '../post-or-comment-options-modal/post-or-comment-options-modal.component';

describe('post options modal component tests', () => {
  const setup = () => {
    const handleHide = jest.fn();
    const handleArchive = jest.fn();

    // Should implement test for functionality of 'Go to post' button

    render(
      <PostOptionsModal
        show={true}
        onHide={handleHide}
        archive={handleArchive}
        isCurrentUserPostOrComment={false}
        postOptionsModal={true}
      />
    );

    return { handleHide, handleArchive };
  };

  it('renders a post options modal', () => {
    setup();

    const postOptionsModal = screen.getByRole('document');

    expect(postOptionsModal).toBeInTheDocument();
  });

  it('clicking cancel button calls hide handler function', () => {
    const { handleHide } = setup();

    const cancelButton = screen.getByTestId('cancel-button');

    userEvent.click(cancelButton);

    expect(handleHide).toBeCalled();
  });

  it('clicking archive button calls archive-post handler function', () => {
    const { handleArchive } = setup();

    const archiveButton = screen.getByTestId('archive-post-button');

    userEvent.click(archiveButton);

    expect(handleArchive).toBeCalled();
  });
});
