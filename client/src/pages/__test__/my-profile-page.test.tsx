import { render, screen } from '../../test-utils/test-utils';
import { MyProfilePage } from '../my-profile/my-profile-page.component';

import { DeleteReactionReq } from '../../redux/post/post.types';

import { UserInfoAndOtherData } from '../../components/user-info/user-info.component';

describe('my-profile-page component tests', () => {
  const setup = () => {
    const commentToDelete = {} as DeleteReactionReq;
    const postLikingUsersArray = [{}, {}] as UserInfoAndOtherData[];

    const getPostDataStart = jest.fn();
    const getPostFileStart = jest.fn();
    const archivePostStart = jest.fn();
    const clearArchivePostStatuses = jest.fn();
    const clearPostState = jest.fn();
    const getFollowersStart = jest.fn();
    const clearFollowersAndFollowing = jest.fn();
    const clearFollowPhotoFileArray = jest.fn();
    const getUsersFollowingStart = jest.fn();
    const clearFollowState = jest.fn();
    const setIsCurrentUserProfilePage = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const deleteReactionStart = jest.fn();
    const setShowPostEditForm = jest.fn();

    render(
      <MyProfilePage
        profilePhotoKey='test-photo-filestring'
        profilePhotoFile={null}
        postError={null}
        getPostDataStart={getPostDataStart}
        getPostDataConfirm='confirm'
        getPostDataError={null}
        getPostFileStart={getPostFileStart}
        getPostFileConfirm='confirm'
        getPostFileError={null}
        archivePostStart={archivePostStart}
        archivePostConfirm={null}
        archivePostError={null}
        commentToDelete={commentToDelete}
        showCommentOptionsModal={false}
        postLikingUsersArray={postLikingUsersArray}
        getSinglePostDataConfirm={null}
        clearArchivePostStatuses={clearArchivePostStatuses}
        clearPostState={clearPostState}
        clearFollowPhotoFileArray={clearFollowPhotoFileArray}
        getFollowersStart={getFollowersStart}
        getUsersFollowingStart={getUsersFollowingStart}
        clearFollowersAndFollowing={clearFollowersAndFollowing}
        clearFollowState={clearFollowState}
        setIsCurrentUserProfilePage={setIsCurrentUserProfilePage}
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
      getFollowersStart,
      clearFollowersAndFollowing,
      clearFollowPhotoFileArray,
      getUsersFollowingStart,
      clearFollowState,
      setIsCurrentUserProfilePage,
      setShowCommentOptionsModal,
      deleteReactionStart,
      setShowPostEditForm,
    };
  };

  it('renders a my-profile-page component', () => {
    const {
      getPostDataStart,
      getPostFileStart,
      getFollowersStart,
      getUsersFollowingStart,
    } = setup();

    const myProfilePage = screen.getByTestId('my-profile-page');

    expect(myProfilePage).toBeInTheDocument();
    expect(getPostDataStart).toBeCalled();
    expect(getPostFileStart).toBeCalled();
    expect(getFollowersStart).toBeCalled();
    expect(getUsersFollowingStart).toBeCalled();
  });
});
