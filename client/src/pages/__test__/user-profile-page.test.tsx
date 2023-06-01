import { render, screen } from '../../test-utils/test-utils';
import { UserProfilePage } from '../user-profile-page/user-profile-page.component';

describe('user-profile-page component tests', () => {
  const setup = () => {
    const getOtherUserStart = jest.fn();
    const getPostDataStart = jest.fn();
    const getPostFileStart = jest.fn();
    const followNewUserStart = jest.fn();
    const clearPostState = jest.fn();
    const getFollowersStart = jest.fn();
    const clearFollowersAndFollowing = jest.fn();
    const clearFollowPhotoFileArray = jest.fn();
    const getUsersFollowingStart = jest.fn();
    const clearFollowState = jest.fn();
    const unfollowUserStart = jest.fn();
    const clearPostFilesAndData = jest.fn();
    const setIsCurrentUserProfilePage = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const deleteReactionStart = jest.fn();

    render(
      <UserProfilePage
        username='giuliano_gabella'
        getOtherUserStart={getOtherUserStart}
        getPostDataStart={getPostDataStart}
        getPostFileStart={getPostFileStart}
        clearFollowPhotoFileArray={clearFollowPhotoFileArray}
        followNewUserStart={followNewUserStart}
        getFollowersStart={getFollowersStart}
        getUsersFollowingStart={getUsersFollowingStart}
        unfollowUserStart={unfollowUserStart}
        clearFollowersAndFollowing={clearFollowersAndFollowing}
        clearPostFilesAndData={clearPostFilesAndData}
        clearFollowState={clearFollowState}
        setIsCurrentUserProfilePage={setIsCurrentUserProfilePage}
        setShowCommentOptionsModal={setShowCommentOptionsModal}
        deleteReactionStart={deleteReactionStart}
        clearPostState={clearPostState}
      />
    );

    return {
      getOtherUserStart,
      getPostDataStart,
      getPostFileStart,
      followNewUserStart,
      clearPostState,
      getFollowersStart,
      clearFollowersAndFollowing,
      clearFollowPhotoFileArray,
      getUsersFollowingStart,
      clearFollowState,
      unfollowUserStart,
      clearPostFilesAndData,
      setIsCurrentUserProfilePage,
      setShowCommentOptionsModal,
      deleteReactionStart,
    };
  };

  it('renders a user-profile-page component', () => {
    const {
      getOtherUserStart,
      getPostFileStart,
      getFollowersStart,
      getUsersFollowingStart,
    } = setup();

    const userProfilePage = screen.getByTestId('user-profile-page');

    expect(userProfilePage).toBeInTheDocument();
    expect(getOtherUserStart).toBeCalled();
    expect(getPostFileStart).toBeCalled();
    expect(getFollowersStart).toBeCalled();
    expect(getUsersFollowingStart).toBeCalled();
  });
});
