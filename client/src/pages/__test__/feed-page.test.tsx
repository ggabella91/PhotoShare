import { render, screen } from '../../test-utils/test-utils';

import { FeedPage } from '../feed-page/feed-page.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';

import {
  Post,
  PostFile,
  PostMetaData,
  DeleteReactionReq,
} from '../../redux/post/post.types';
import { User } from '../../redux/user/user.types';
import { Follower } from '../../redux/follower/follower.types';

describe('feed page component tests', () => {
  const setup = () => {
    const currentUser = {} as User;
    const currentUserUsersFollowing = [{}, {}] as Follower[];
    const followingInfo = [{}, {}] as User[];
    const postDataFeedArray = [
      [{}, {}],
      [{}, {}],
    ] as Post[][];
    const postFiles = [{}, {}, {}, {}] as PostFile[];
    const commentToDelete = {} as DeleteReactionReq;
    const followPhotoFileArray = [{}, {}] as PostFile[];
    const clearFollowState = jest.fn();
    const clearFollowersAndFollowing = jest.fn();
    const clearPostState = jest.fn();
    const getPostDataStart = jest.fn();
    const getPostFileStart = jest.fn();
    const getOtherUserStart = jest.fn();
    const getUsersFollowingStart = jest.fn();
    const postMetaData = {} as PostMetaData;
    const feedPagePostModalData = {} as PostModalDataToFeed;
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
        currentUser={currentUser}
        currentUserUsersFollowing={currentUserUsersFollowing}
        followingInfo={followingInfo}
        clearFollowState={clearFollowState}
        getUsersFollowingConfirm='confirm'
        clearFollowersAndFollowing={clearFollowersAndFollowing}
        clearPostState={clearPostState}
        postDataFeedArray={postDataFeedArray}
        postError={null}
        postFiles={postFiles}
        getPostDataError={null}
        getPostDataStart={getPostDataStart}
        getPostFileStart={getPostFileStart}
        getPostFileConfirm='confirm'
        getPostFileError={null}
        getOtherUserStart={getOtherUserStart}
        getUsersFollowingStart={getUsersFollowingStart}
        followPhotoFileArray={followPhotoFileArray}
        isLoadingPostData={false}
        postMetaDataForUser={postMetaData}
        getFeedPostDataConfirm={null}
        postLikingUsersArray={[]}
        showPostLikingUsersModal={false}
        feedPagePostModalData={feedPagePostModalData}
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
