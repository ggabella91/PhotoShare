import { FeedPage } from '../feed-page/feed-page.component';
import { render } from '../../test-utils/test-utils';

import {
  getOtherUserStart,
  clearFollowersAndFollowing,
} from '../../redux/user/user.actions';

import {
  getPostDataStart,
  getPostFileStart,
  clearPostState,
  archivePostStart,
  setShowPostLikingUsersModal,
  setFeedPagePostModalShow,
  setFeedPagePostOptionsModalShow,
  setClearFeedPagePostModalState,
  setShowCommentOptionsModal,
  deleteReactionStart,
} from '../../redux/post/post.actions';

import {
  getUsersFollowingStart,
  clearFollowState,
} from '../../redux/follower/follower.actions';

it('renders a feed page component', () => {
  const { container: feedPage } = render(
    <FeedPage
      currentUser={null}
      currentUserUsersFollowing={[]}
      followingInfo={[]}
      clearFollowState={() => clearFollowState()}
      getUsersFollowingConfirm=''
      clearFollowersAndFollowing={() => clearFollowersAndFollowing()}
      clearPostState={() => clearPostState()}
      postDataFeedArray={[]}
      postConfirm=''
      postError={null}
      postFiles={[]}
      getPostDataError={null}
      getPostDataStart={(dataReq) => getPostDataStart(dataReq)}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      getPostFileConfirm=''
      getPostFileError={null}
      getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
      getUsersFollowingStart={(usersFollowingRequest) =>
        getUsersFollowingStart(usersFollowingRequest)
      }
      followPhotoFileArray={[]}
      isLoadingPostData={false}
      postMetaDataForUser={{ queryLength: 0, userId: '' }}
      getFeedPostDataConfirm={null}
      postLikingUsersArray={[]}
      showPostLikingUsersModal={false}
      feedPagePostModalData={{
        id: '',
        postUserId: '',
        postUserName: '',
        postS3Key: '',
        postPhotoFileString: '',
        profilePhotoFileString: '',
        caption: '',
        location: '',
        date: '',
      }}
      feedPagePostModalShow={false}
      feedPagePostOptionsModalShow={false}
      clearFeedPagePostModalState={false}
      showCommentOptionsModal={false}
      commentToDelete={null}
      archivePostStart={(archiveReq) => archivePostStart(archiveReq)}
      setShowPostLikingUsersModal={(setShowVal) =>
        setShowPostLikingUsersModal(setShowVal)
      }
      setFeedPagePostModalShow={(setShowVal) =>
        setFeedPagePostModalShow(setShowVal)
      }
      setFeedPagePostOptionsModalShow={(setShowVal) =>
        setFeedPagePostOptionsModalShow(setShowVal)
      }
      setClearFeedPagePostModalState={(setShowVal) =>
        setClearFeedPagePostModalState(setShowVal)
      }
      setShowCommentOptionsModal={(setShowVal) =>
        setShowCommentOptionsModal(setShowVal)
      }
      deleteReactionStart={(delReq) => deleteReactionStart(delReq)}
    />
  );

  expect(feedPage).toBeInTheDocument();
});
