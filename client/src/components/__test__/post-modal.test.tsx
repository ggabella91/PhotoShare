import { render, screen } from '../../test-utils/test-utils';
import { PostModal } from '../post-modal/post-modal.component';

describe('post modal component tests', () => {
  const setup = () => {
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
        location='here'
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

    screen.debug();

    // expect(postModal).toBeInTheDocument();
  });
});
