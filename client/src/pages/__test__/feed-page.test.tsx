import { render, screen } from '../../test-utils/test-utils';

import { FeedPage } from '../feed-page/feed-page.component';

describe('feed page component tests', () => {
  const setup = () => {
    const clearFollowState = jest.fn();
    const clearFollowersAndFollowing = jest.fn();
    const getOtherUserStart = jest.fn();
    const getUsersFollowingStart = jest.fn();
    const setShowPostLikingUsersModal = jest.fn();
    const setFeedPagePostModalShow = jest.fn();
    const setFeedPagePostOptionsModalShow = jest.fn();
    const setClearFeedPagePostModalState = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const deleteReactionStart = jest.fn();
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;

    render(
      <FeedPage
        clearFollowState={clearFollowState}
        clearFollowersAndFollowing={clearFollowersAndFollowing}
        getOtherUserStart={getOtherUserStart}
        getUsersFollowingStart={getUsersFollowingStart}
        setShowPostLikingUsersModal={setShowPostLikingUsersModal}
        setFeedPagePostModalShow={setFeedPagePostModalShow}
        setFeedPagePostOptionsModalShow={setFeedPagePostOptionsModalShow}
        setClearFeedPagePostModalState={setClearFeedPagePostModalState}
        setShowCommentOptionsModal={setShowCommentOptionsModal}
        deleteReactionStart={deleteReactionStart}
      />
    );

    return {
      clearFollowState,
      clearFollowersAndFollowing,
      getOtherUserStart,
      getUsersFollowingStart,
      setShowPostLikingUsersModal,
      setFeedPagePostModalShow,
      setFeedPagePostOptionsModalShow,
      setClearFeedPagePostModalState,
      setShowCommentOptionsModal,
      deleteReactionStart,
    };
  };

  it('render a feed page component', () => {
    const { getOtherUserStart, getUsersFollowingStart } = setup();

    const feedPage = screen.getByTestId('feed-page');

    const feedPostContainers = screen.getAllByTestId('feed-post-container');

    expect(feedPage).toBeInTheDocument();
    expect(getOtherUserStart).toBeCalled();
    expect(getUsersFollowingStart).toBeCalled();
    expect(feedPostContainers.length).toEqual(4);
  });
});
