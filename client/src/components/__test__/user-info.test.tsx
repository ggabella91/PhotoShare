import { shallow } from 'enzyme';
import React from 'react';
import { List } from 'immutable';

import { DeleteReactionReq } from '../../redux/post/post.types';
import {
  deleteReactionStart,
  setShowCommentOptionsModal,
  setShowPostEditForm,
} from '../../redux/post/post.actions';

import { UserInfo, StyleType } from '../user-info/user-info.component';

it('renders a user-suggestions component', () => {
  const userInfoWrapper = shallow(
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
    />
  );

  expect(userInfoWrapper).toMatchSnapshot();
});
