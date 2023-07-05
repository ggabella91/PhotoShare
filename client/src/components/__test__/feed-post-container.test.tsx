import { render, screen } from '../../test-utils/test-utils';
import {
  FeedPostContainer,
  PostModalDataToFeed,
} from '../feed-post-container/feed-post-container.component';

import {
  DeleteReactionReq,
  PostFileReq,
  Location,
} from '../../redux/post/post.types';
import {
  createPostReactionStart,
  getPostReactionsStart,
  deleteReactionStart,
  getPostFileStart,
  setPostLikingUsersArray,
  setFeedPagePostModalData,
  setFeedPagePostModalShow,
  setClearFeedPagePostModalState,
  setShowPostLikingUsersModal,
  clearPostReactions,
} from '../../redux/post/post.actions';
import { OtherUserRequest } from '../../redux/user/user.types';
import { getOtherUserStart } from '../../redux/user/user.actions';
import { UserInfoAndOtherData } from '../user-info/user-info.component';

describe('feed post container component tests', () => {
  const setup = () => {
    const testLocation = { label: 'Bali' } as Location;

    render(
      <FeedPostContainer
        id='1'
        s3Key='post-key'
        custRef={null}
        key='0'
        caption='test caption'
        userInfo={{
          profilePhotoFileString: 'sndfjnbss',
          username: 'test-user',
          location: testLocation,
          name: 'Test User',
          userId: 'user-id',
          postId: 'post-id',
          comment: 'comment',
        }}
        fileString='string'
        date='March 19th 2021'
        getOtherUserStart={(otherUserReq: OtherUserRequest) =>
          getOtherUserStart(otherUserReq)
        }
        getPostFileStart={(postFileReq: PostFileReq) =>
          getPostFileStart(postFileReq)
        }
        createPostReactionStart={(reactionReq) =>
          createPostReactionStart(reactionReq)
        }
        deleteReactionStart={(deleteReactionReq: DeleteReactionReq) =>
          deleteReactionStart(deleteReactionReq)
        }
        getPostReactionsStart={(postId) => getPostReactionsStart(postId)}
        setPostLikingUsersArray={(
          postLikingUsersArray: UserInfoAndOtherData[]
        ) => setPostLikingUsersArray(postLikingUsersArray)}
        setShowPostLikingUsersModal={(showPostLikingUsersModal: boolean) =>
          setShowPostLikingUsersModal(showPostLikingUsersModal)
        }
        setFeedPagePostModalData={(postModalDataToFeed: PostModalDataToFeed) =>
          setFeedPagePostModalData(postModalDataToFeed)
        }
        setFeedPagePostModalShow={(feedPagePostModalShow: boolean) =>
          setFeedPagePostModalShow(feedPagePostModalShow)
        }
        setClearFeedPagePostModalState={(
          clearFeedPagePostModalState: boolean
        ) => setClearFeedPagePostModalState(clearFeedPagePostModalState)}
        clearPostReactions={() => clearPostReactions()}
      />
    );
  };

  it('expect to render a feed post container component', () => {
    setup();

    const feedPostContainer = screen.getByTestId('feed-post-container');

    expect(feedPostContainer).toBeInTheDocument();
  });

  it('expect submit-comment button to be disabled when no comment has been entered', () => {
    setup();

    const submitButton = screen.getByTestId('submit-comment-button');

    expect(submitButton).toBeDisabled();
  });
});
