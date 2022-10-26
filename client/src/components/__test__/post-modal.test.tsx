import { render, screen, userEvent } from '../../test-utils/test-utils';
import { Location } from '../../redux/post/post.types';
import { PostModal } from '../post-modal/post-modal.component';

describe('post modal component tests', () => {
  const setup = () => {
    const testLocation = { label: 'test location' } as Location;
    const handleHide = jest.fn();
    const handleOptionsClick = jest.fn();
    const createPostReactionStart = jest.fn();
    const getPostReactionsStart = jest.fn();
    const getPostFileStart = jest.fn();
    const deleteReactionStart = jest.fn();
    const getOtherUserStart = jest.fn();
    const setPostLikingUsersArray = jest.fn();
    const clearPostReactions = jest.fn();
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
        createPostReactionStart={createPostReactionStart}
        postReactionsArray={[]}
        postReactionConfirm={null}
        postReactionError={null}
        getPostReactionsStart={getPostReactionsStart}
        getPostReactionsConfirm=''
        getPostReactionsError={null}
        currentUser={null}
        clearLocalState={false}
        postReactingUsers={[]}
        reactorPhotoFileArray={[]}
        usersProfilePhotoConfirm={null}
        deleteReactionConfirm={null}
        deleteReactionError={null}
        showPostEditForm={false}
        editPostDetailsConfirm={null}
        getPostFileStart={getPostFileStart}
        getOtherUserStart={getOtherUserStart}
        deleteReactionStart={deleteReactionStart}
        setPostLikingUsersArray={setPostLikingUsersArray}
        clearPostReactions={clearPostReactions}
        setShowPostEditForm={setShowPostEditForm}
        getSinglePostDataStart={getSinglePostDataStart}
        clearPostState={clearPostState}
      />
    );

    return {
      handleHide,
      handleOptionsClick,
      createPostReactionStart,
      getPostReactionsStart,
      getPostFileStart,
      deleteReactionStart,
      getOtherUserStart,
      setPostLikingUsersArray,
      clearPostReactions,
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

  it('Clicking post-comment button calls redux action creator for creating a post reaction', () => {
    const { createPostReactionStart } = setup();

    const textAreaInput = screen.getByRole('textbox');

    userEvent.type(textAreaInput, 'Test comment');

    const createReactionButton = screen.getByTestId(
      'create-post-reaction-button'
    );

    userEvent.click(createReactionButton);

    expect(createPostReactionStart).toBeCalled();
  });
});
