import { render, screen } from '../../test-utils/test-utils';
import {
  FeedPostContainer,
  PostModalDataToFeed,
} from '../feed-post-container/feed-post-container.component';

import { DeleteReactionReq, PostFileReq } from '../../redux/post/post.types';
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
  const setup = () =>
    render(
      <FeedPostContainer
        s3Key='post-key'
        custRef={null}
        key='0'
        currentUser={{
          name: 'test name',
          username: 'testname',
          id: '2323',
          email: 'test@test.com',
        }}
        caption='test caption'
        userInfo={{
          profilePhotoFileString: 'sndfjnbss',
          username: 'test-user',
          location: 'Bali',
          name: 'Test User',
          userId: 'user-id',
          postId: 'post-id',
          comment: 'comment',
        }}
        fileString='string'
        date='March 19th 2021'
        feedPostReactionsArray={[]}
        getOtherUserStart={(otherUserReq: OtherUserRequest) =>
          getOtherUserStart(otherUserReq)
        }
        getPostFileStart={(postFileReq: PostFileReq) =>
          getPostFileStart(postFileReq)
        }
        feedPostReactingUsers={[]}
        reactorPhotoFileArray={[]}
        usersProfilePhotoConfirm=''
        createPostReactionStart={(reactionReq) =>
          createPostReactionStart(reactionReq)
        }
        deleteReactionStart={(deleteReactionReq: DeleteReactionReq) =>
          deleteReactionStart(deleteReactionReq)
        }
        deleteReactionConfirm={{ reactionId: '', postId: '', message: '' }}
        postReactionConfirm={{
          reactionId: '',
          message: '',
          likedPost: false,
          postId: '',
        }}
        postReactionError={null}
        getPostReactionsStart={(postId) => getPostReactionsStart(postId)}
        getPostReactionsConfirm=''
        getPostReactionsError={null}
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
