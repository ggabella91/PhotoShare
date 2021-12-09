import { render, screen, userEvent } from '../../test-utils/test-utils';

import { List } from 'immutable';

import {
  UserInfo,
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

describe('user info component tests', () => {
  const setup = (type: StyleType) => {
    const userInfoList = List([{}, {}, {}]) as List<UserInfoAndOtherData>;
    const setCommentToDelete = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const setShowPostEditForm = jest.fn();
    const setFeedPagePostOptionsModalShow = jest.fn();

    render(
      <UserInfo
        userInfoList={userInfoList}
        styleType={type}
        setCommentToDelete={setCommentToDelete}
        setShowCommentOptionsModal={setShowCommentOptionsModal}
        setShowPostEditForm={setShowPostEditForm}
        setFeedPagePostOptionsModalShow={setFeedPagePostOptionsModalShow}
      />
    );

    return {
      setCommentToDelete,
      setShowCommentOptionsModal,
      setShowPostEditForm,
      setFeedPagePostOptionsModalShow,
    };
  };

  it('renders a user suggestions container component', () => {
    setup(StyleType.suggestion);

    const userSuggestionContainer = screen.getByTestId(
      'user-suggestion-container'
    );

    expect(userSuggestionContainer).toBeInTheDocument();
  });

  it('renders a user modal container component', () => {
    setup(StyleType.modal);

    const userModalContainer = screen.getByTestId('user-modal-container');

    expect(userModalContainer).toBeInTheDocument();
  });

  it('renders a user comment container component', () => {
    setup(StyleType.comment);

    const userCommentContainer = screen.getByTestId('user-comment-container');

    expect(userCommentContainer).toBeInTheDocument();
  });

  it('renders a user feed container component', () => {
    setup(StyleType.feed);

    const userFeedContainer = screen.getByTestId('user-feed-container');

    expect(userFeedContainer).toBeInTheDocument();
  });

  it('renders a user post-page container component', () => {
    setup(StyleType.postPage);

    const userPostPageContainer = screen.getByTestId(
      'user-post-page-container'
    );

    expect(userPostPageContainer).toBeInTheDocument();
  });
});
