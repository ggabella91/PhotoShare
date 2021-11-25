import { render } from '../../test-utils/test-utils';
import { UserProfilePage } from '../user-profile-page/user-profile-page.component';

import {
  getOtherUserStart,
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
} from '../../redux/user/user.actions';

import { PostDataReq, PostFileReq } from '../../redux/post/post.types';
import {
  getPostDataStart,
  getPostFileStart,
  clearFollowPhotoFileArray,
  clearPostFilesAndData,
  setShowCommentOptionsModal,
  deleteReactionStart,
  clearPostState,
} from '../../redux/post/post.actions';

import {
  followNewUserStart,
  getFollowersStart,
  getUsersFollowingStart,
  unfollowUserStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

it('renders a my-profile-page component', () => {
  const { container: userProfilePageWrapper } = render(
    <UserProfilePage
      username='giuliano_gabella'
      otherUser={null}
      otherUserError={null}
      getOtherUserStart={(username) => getOtherUserStart(username)}
      profilePhotoFile={null}
      postData={null}
      postFiles={[]}
      postConfirm={null}
      postError={null}
      getPostDataStart={(postDataReq: PostDataReq) =>
        getPostDataStart(postDataReq)
      }
      getPostDataConfirm={null}
      getPostDataError={null}
      getPostFileStart={(fileReq: PostFileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm={null}
      getPostFileError={null}
      followConfirm={null}
      followers={[]}
      currentUserUsersFollowing={[]}
      otherUserUsersFollowing={[]}
      getFollowersConfirm={null}
      getUsersFollowingConfirm={null}
      currentUser={null}
      unfollowConfirm={null}
      unfollowError={null}
      isCurrentUserProfilePage={false}
      commentToDelete={null}
      showCommentOptionsModal={false}
      postLikingUsersArray={[]}
      clearFollowPhotoFileArray={() => clearFollowPhotoFileArray()}
      followNewUserStart={(userToFollowId) =>
        followNewUserStart(userToFollowId)
      }
      getFollowersStart={(userId) => getFollowersStart(userId)}
      getUsersFollowingStart={(req) => getUsersFollowingStart(req)}
      unfollowUserStart={(id) => unfollowUserStart(id)}
      clearFollowersAndFollowing={() => clearFollowersAndFollowing()}
      clearPostFilesAndData={() => clearPostFilesAndData()}
      clearFollowState={() => clearFollowState()}
      setIsCurrentUserProfilePage={(isCurrentUserProfilePage) =>
        setIsCurrentUserProfilePage(isCurrentUserProfilePage)
      }
      setShowCommentOptionsModal={(show) => setShowCommentOptionsModal(show)}
      deleteReactionStart={(deleteReactionReq) =>
        deleteReactionStart(deleteReactionReq)
      }
      clearPostState={() => clearPostState()}
    />
  );

  expect(userProfilePageWrapper).toBeInTheDocument();
});
