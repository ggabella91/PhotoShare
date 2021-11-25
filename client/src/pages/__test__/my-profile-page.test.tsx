import { render } from '../../test-utils/test-utils';
import { MyProfilePage } from '../my-profile/my-profile-page.component';

import {
  getPostDataStart,
  getPostFileStart,
  archivePostStart,
  clearArchivePostStatuses,
  clearPostState,
  clearFollowPhotoFileArray,
  setShowCommentOptionsModal,
  deleteReactionStart,
  setShowPostEditForm,
} from '../../redux/post/post.actions';

import {
  clearFollowersAndFollowing,
  setIsCurrentUserProfilePage,
} from '../../redux/user/user.actions';

import {
  getFollowersStart,
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

it('renders a my-profile-page component', () => {
  const { container: myProfilePageWrapper } = render(
    <MyProfilePage
      currentUser={null}
      profilePhotoKey={null}
      profilePhotoFile={null}
      postData={null}
      postFiles={[]}
      postConfirm={null}
      postError={null}
      getPostDataStart={(userId) => getPostDataStart(userId)}
      getPostDataConfirm={null}
      getPostDataError={null}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm={null}
      getPostFileError={null}
      archivePostStart={(archivePostReq) => archivePostStart(archivePostReq)}
      archivePostConfirm={null}
      archivePostError={null}
      followers={[]}
      currentUserUsersFollowing={[]}
      getUsersFollowingConfirm={null}
      commentToDelete={{
        postId: '',
        reactingUserId: '',
        reactionId: '',
        isLikeRemoval: false,
      }}
      showCommentOptionsModal={false}
      postLikingUsersArray={[]}
      getSinglePostDataConfirm={null}
      clearArchivePostStatuses={() => clearArchivePostStatuses()}
      clearPostState={() => clearPostState()}
      clearFollowPhotoFileArray={() => clearFollowPhotoFileArray()}
      getFollowersStart={(userId) => getFollowersStart(userId)}
      getUsersFollowingStart={(userId) => getUsersFollowingStart(userId)}
      clearFollowersAndFollowing={() => clearFollowersAndFollowing()}
      clearFollowState={() => clearFollowState()}
      setIsCurrentUserProfilePage={(isCurrentUserProfilePage) =>
        setIsCurrentUserProfilePage(isCurrentUserProfilePage)
      }
      setShowCommentOptionsModal={(show) => setShowCommentOptionsModal(show)}
      deleteReactionStart={(deleteReactionReq) =>
        deleteReactionStart(deleteReactionReq)
      }
      setShowPostEditForm={(show) => setShowPostEditForm(show)}
    />
  );

  expect(myProfilePageWrapper).toBeInTheDocument();
});
