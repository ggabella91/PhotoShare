import { render, screen, userEvent } from '../../test-utils/test-utils';
import { Location } from '../../redux/post/post.types';
import { PostModal } from '../post-modal/post-modal.component';

describe('post modal component tests', () => {
  const setup = () => {
    console.error = jest.fn();
    const testLocation = { label: 'test location' } as Location;
    const handleHide = jest.fn();
    const handleOptionsClick = jest.fn();
    const setPostLikingUsersArray = jest.fn();
    const setShowPostEditForm = jest.fn();
    const clearPostState = jest.fn();
    const getSinglePostDataStart = jest.fn();

    render(
      <PostModal
        caption='hi'
        location={testLocation}
        createdAt={new Date('Sat Jan 02 2021')}
        show={true}
        fileString='string'
        userName='Giuliano'
        onHide={handleHide}
        onOptionsClick={handleOptionsClick}
        userProfilePhotoFile='userFile'
        postId=''
        userId=''
        clearLocalState={false}
        setPostLikingUsersArray={setPostLikingUsersArray}
        setShowPostEditForm={setShowPostEditForm}
        getSinglePostDataStart={getSinglePostDataStart}
        clearPostState={clearPostState}
      />
    );

    return {
      handleHide,
      handleOptionsClick,
      setPostLikingUsersArray,
      setShowPostEditForm,
      getSinglePostDataStart,
      clearPostState,
    };
  };

  it('expect to render a post modal component', () => {
    setup();

    const postModal = screen.getByRole('dialog');

    expect(postModal).toBeInTheDocument();
  });

  it('Clicking close button calls hide handler function', () => {
    const { handleHide } = setup();

    const hideButton = screen.getByText(/Close/i).parentElement;

    userEvent.click(hideButton!);

    expect(handleHide).toBeCalled();
  });

  it('Clicking options button calls options handler', () => {
    const { handleOptionsClick } = setup();

    const optionsButton = screen.getByTestId('options-button');

    userEvent.click(optionsButton);

    expect(handleOptionsClick).toBeCalled();
  });

  it('Clicking post-comment button calls redux action creator for creating a post reaction without throwing an error', () => {
    setup();

    const textAreaInput = screen.getByRole('textbox');

    userEvent.type(textAreaInput, 'Test comment');

    const createReactionButton = screen.getByTestId(
      'create-post-reaction-button'
    );

    userEvent.click(createReactionButton);

    expect(console.error).not.toHaveBeenCalled();
  });
});
