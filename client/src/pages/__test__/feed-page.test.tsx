import { render, screen } from '../../test-utils/test-utils';

import { FeedPage } from '../feed-page/feed-page.component';

import { DeleteReactionReq } from '../../redux/post/post.types';

describe('feed page component tests', () => {
  const setup = () => {
    const commentToDelete = {} as DeleteReactionReq;
    const clearFollowState = jest.fn();
    const clearFollowersAndFollowing = jest.fn();
    const clearPostState = jest.fn();
    const getPostDataStart = jest.fn();
    const getPostFileStart = jest.fn();
    const getOtherUserStart = jest.fn();
    const getUsersFollowingStart = jest.fn();
    const archivePostStart = jest.fn();
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
        clearPostState={clearPostState}
        getPostDataStart={getPostDataStart}
        getPostFileStart={getPostFileStart}
        getOtherUserStart={getOtherUserStart}
        getUsersFollowingStart={getUsersFollowingStart}
        feedPagePostModalShow={false}
        feedPagePostOptionsModalShow={false}
        clearFeedPagePostModalState={false}
        showCommentOptionsModal={false}
        commentToDelete={commentToDelete}
        archivePostStart={archivePostStart}
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
      clearPostState,
      getPostDataStart,
      getPostFileStart,
      getOtherUserStart,
      getUsersFollowingStart,
      archivePostStart,
      setShowPostLikingUsersModal,
      setFeedPagePostModalShow,
      setFeedPagePostOptionsModalShow,
      setClearFeedPagePostModalState,
      setShowCommentOptionsModal,
      deleteReactionStart,
    };
  };

  it('render a feed page component', () => {
    const {
      getPostDataStart,
      getPostFileStart,
      getOtherUserStart,
      getUsersFollowingStart,
    } = setup();

    const feedPage = screen.getByTestId('feed-page');

    const feedPostContainers = screen.getAllByTestId('feed-post-container');

    expect(feedPage).toBeInTheDocument();
    expect(getPostDataStart).toBeCalled();
    expect(getPostFileStart).toBeCalled();
    expect(getOtherUserStart).toBeCalled();
    expect(getUsersFollowingStart).toBeCalled();
    expect(feedPostContainers.length).toEqual(4);
  });
});
