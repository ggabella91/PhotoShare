import { shallow } from 'enzyme';
import React from 'react';
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

it('expect to render a feed post container component', () => {
  const feedPostContainerWrapper = shallow(
    <FeedPostContainer
      s3Key=''
      custRef={null}
      key=''
      currentUser={null}
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
      setPostLikingUsersArray={(postLikingUsersArray: UserInfoAndOtherData[]) =>
        setPostLikingUsersArray(postLikingUsersArray)
      }
      setShowPostLikingUsersModal={(showPostLikingUsersModal: boolean) =>
        setShowPostLikingUsersModal(showPostLikingUsersModal)
      }
      setFeedPagePostModalData={(postModalDataToFeed: PostModalDataToFeed) =>
        setFeedPagePostModalData(postModalDataToFeed)
      }
      setFeedPagePostModalShow={(feedPagePostModalShow: boolean) =>
        setFeedPagePostModalShow(feedPagePostModalShow)
      }
      setClearFeedPagePostModalState={(clearFeedPagePostModalState: boolean) =>
        setClearFeedPagePostModalState(clearFeedPagePostModalState)
      }
      clearPostReactions={() => clearPostReactions()}
    />
  );

  expect(feedPostContainerWrapper).toMatchSnapshot();
});
