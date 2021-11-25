import { render } from '../../test-utils/test-utils';
import { PostModal } from '../post-modal/post-modal.component';

import { getOtherUserStart } from '../../redux/user/user.actions';

import {
  createPostReactionStart,
  getPostReactionsStart,
  getPostFileStart,
  deleteReactionStart,
  setPostLikingUsersArray,
  clearPostReactions,
  setShowPostEditForm,
  getSinglePostDataStart,
  clearPostState,
} from '../../redux/post/post.actions';

it('expect to render a post modal component', () => {
  const { container: postModal } = render(
    <PostModal
      caption='hi'
      location='here'
      createdAt={new Date('Sat Jan 02 2021')}
      show={true}
      fileString='string'
      userName='Giuliano'
      onHide={() => {}}
      onOptionsClick={() => {}}
      userProfilePhotoFile='userFile'
      postId=''
      userId=''
      createPostReactionStart={(reactionReq) =>
        createPostReactionStart(reactionReq)
      }
      postReactionsArray={[]}
      postReactionConfirm={null}
      postReactionError={null}
      getPostReactionsStart={(postId) => getPostReactionsStart(postId)}
      getPostReactionsConfirm=''
      getPostReactionsError={null}
      currentUser={null}
      clearLocalState={false}
      postReactingUsers={[]}
      reactorPhotoFileArray={[]}
      usersProfilePhotoConfirm={null}
      deleteReactionConfirm={null}
      deleteReactionError={null}
      showPostEditForm={false}
      editPostDetailsConfirm={null}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      getOtherUserStart={(otherUserReq) => getOtherUserStart(otherUserReq)}
      deleteReactionStart={(deleteReq) => deleteReactionStart(deleteReq)}
      setPostLikingUsersArray={(postLikingUsersArray) =>
        setPostLikingUsersArray(postLikingUsersArray)
      }
      clearPostReactions={() => clearPostReactions()}
      setShowPostEditForm={(show) => setShowPostEditForm(show)}
      getSinglePostDataStart={(singlePostDataReq) =>
        getSinglePostDataStart(singlePostDataReq)
      }
      clearPostState={() => clearPostState()}
    />
  );

  expect(postModal).toBeInTheDocument();
});
