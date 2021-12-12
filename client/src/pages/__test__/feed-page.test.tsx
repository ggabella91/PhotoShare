import { render, screen, userEvent } from '../../test-utils/test-utils';

import { FeedPage } from '../feed-page/feed-page.component';
import { PostModalDataToFeed } from '../../components/feed-post-container/feed-post-container.component';

import { PostMetaData } from '../../redux/post/post.types';

describe('feed page component tests', () => {
  const setup = () => {
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

    render(
      <FeedPage
        currentUser={null}
        currentUserUsersFollowing={[]}
        followingInfo={[]}
        clearFollowState={clearFollowState}
        getUsersFollowingConfirm=''
        clearFollowersAndFollowing={clearFollowersAndFollowing}
        clearPostState={clearPostState}
        postDataFeedArray={[]}
        postConfirm=''
        postError={null}
        postFiles={[]}
        getPostDataError={null}
        getPostDataStart={getPostDataStart}
        getPostFileStart={getPostFileStart}
        getPostFileConfirm=''
        getPostFileError={null}
        getOtherUserStart={getOtherUserStart}
        getUsersFollowingStart={getUsersFollowingStart}
        followPhotoFileArray={[]}
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
        commentToDelete={null}
        archivePostStart={archivePostStart}
        setShowPostLikingUsersModal={setShowPostLikingUsersModal}
        setFeedPagePostModalShow={setFeedPagePostModalShow}
        setFeedPagePostOptionsModalShow={setFeedPagePostOptionsModalShow}
        setClearFeedPagePostModalState={setClearFeedPagePostModalState}
        setShowCommentOptionsModal={setShowCommentOptionsModal}
        deleteReactionStart={deleteReactionStart}
      />
    );
  };

  it('render a feed page component', () => {
    setup();

    const feedPage = screen.getByTestId('feed-page');

    expect(feedPage).toBeInTheDocument();
  });
});
