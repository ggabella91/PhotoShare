import { render } from '../../test-utils/test-utils';

import { List } from 'immutable';

import { DeleteReactionReq } from '../../redux/post/post.types';
import {
  deleteReactionStart,
  setShowCommentOptionsModal,
  setShowPostEditForm,
  setFeedPagePostOptionsModalShow,
} from '../../redux/post/post.actions';

import { UserInfo, StyleType } from '../user-info/user-info.component';

it('renders a user-suggestions component', () => {
  const { container: userInfo } = render(
    <UserInfo
      userInfoList={List()}
      styleType={StyleType.suggestion}
      setCommentToDelete={(deleteReactionReq: DeleteReactionReq) =>
        deleteReactionStart(deleteReactionReq)
      }
      setShowCommentOptionsModal={(showCommentOptionsModal: boolean) =>
        setShowCommentOptionsModal(showCommentOptionsModal)
      }
      setShowPostEditForm={(showPostEditForm: boolean) =>
        setShowPostEditForm(showPostEditForm)
      }
      setFeedPagePostOptionsModalShow={(show) =>
        setFeedPagePostOptionsModalShow(show)
      }
    />
  );

  expect(userInfo).toBeInTheDocument();
});
