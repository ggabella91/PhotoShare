import { render, screen } from '../../test-utils/test-utils';
import { MyProfilePage } from '../my-profile/my-profile-page.component';

describe('my-profile-page component tests', () => {
  const setup = () => {
    const getPostDataStart = jest.fn();
    const getPostFileStart = jest.fn();
    const archivePostStart = jest.fn();
    const clearArchivePostStatuses = jest.fn();
    const clearPostState = jest.fn();
    const clearFollowPhotoFileArray = jest.fn();
    const clearFollowState = jest.fn();
    const setIsCurrentUserProfilePage = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const deleteReactionStart = jest.fn();
    const setShowPostEditForm = jest.fn();

    render(
      <MyProfilePage
        getPostDataStart={getPostDataStart}
        getPostFileStart={getPostFileStart}
        archivePostStart={archivePostStart}
        clearArchivePostStatuses={clearArchivePostStatuses}
        clearPostState={clearPostState}
        clearFollowPhotoFileArray={clearFollowPhotoFileArray}
        setShowCommentOptionsModal={setShowCommentOptionsModal}
        deleteReactionStart={deleteReactionStart}
        setShowPostEditForm={setShowPostEditForm}
      />
    );

    return {
      getPostDataStart,
      getPostFileStart,
      archivePostStart,
      clearArchivePostStatuses,
      clearPostState,
      clearFollowPhotoFileArray,
      clearFollowState,
      setIsCurrentUserProfilePage,
      setShowCommentOptionsModal,
      deleteReactionStart,
      setShowPostEditForm,
    };
  };

  it('renders a my-profile-page component', () => {
    const { getPostDataStart, getPostFileStart } = setup();

    const myProfilePage = screen.getByTestId('my-profile-page');

    expect(myProfilePage).toBeInTheDocument();
    expect(getPostDataStart).toBeCalled();
    expect(getPostFileStart).toBeCalled();
  });
});
