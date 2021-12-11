import { render, screen, userEvent } from '../../test-utils/test-utils';

import { List } from 'immutable';

import {
  UserInfo,
  StyleType,
  UserInfoAndOtherData,
} from '../user-info/user-info.component';

describe('user info component tests', () => {
  const setup = (type: StyleType, caption?: boolean) => {
    const userInfoEl = {
      name: 'bob',
      username: 'testbob',
      reactingUserId: '12345',
      reactionId: 'jgt3u4t34ut',
    } as UserInfoAndOtherData;
    const userCommentList = List([
      userInfoEl,
      {},
      {},
    ]) as List<UserInfoAndOtherData>;
    const userCaption = List([
      { comment: 'test caption', location: 'test location' },
    ]) as List<UserInfoAndOtherData>;
    const userInfoList = List([{}, {}, {}]) as List<UserInfoAndOtherData>;
    const userInfoListFeed = List([{}]) as List<UserInfoAndOtherData>;

    const setCommentToDelete = jest.fn();
    const setShowCommentOptionsModal = jest.fn();
    const setShowPostEditForm = jest.fn();
    const setFeedPagePostOptionsModalShow = jest.fn();

    render(
      <UserInfo
        userInfoList={
          type === 'comment'
            ? caption
              ? userCaption
              : userCommentList
            : type === 'feed'
            ? userInfoListFeed
            : userInfoList
        }
        styleType={type}
        isCaption={type === 'comment' && caption}
        isCaptionOwner={caption}
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

  it('hovering over a comment in a user comment container component renders the ellipsis button, and clicking it causes calls the redux actions to set the comment for deletion and to show the comment options modal', () => {
    const { setCommentToDelete, setShowCommentOptionsModal } = setup(
      StyleType.comment
    );

    const firstComment = screen.getByTestId('user-comment-element-0');

    userEvent.hover(firstComment);

    const ellipsisButton = screen.getAllByTestId('comment-ellipsis-button')[0];

    userEvent.click(ellipsisButton);

    expect(setCommentToDelete).toBeCalled();
    expect(setShowCommentOptionsModal).toBeCalled();
  });

  it('hovering over a caption in a user comment container component renders the ellipsis button, and clicking it causes calls the redux action to show the post-edit form', () => {
    const { setShowPostEditForm } = setup(StyleType.comment, true);

    const firstComment = screen.getByTestId('user-comment-element-0');

    userEvent.hover(firstComment);

    screen.debug();

    const ellipsisButton = screen.getByTestId('caption-ellipsis-button');

    userEvent.click(ellipsisButton);

    expect(setShowPostEditForm).toBeCalled();
  });

  it('clicking on the ellipsis button in a user feed component causes the redux action to show the feed page post-options modal to be called', () => {
    const { setFeedPagePostOptionsModalShow } = setup(StyleType.feed);

    const ellipsisButton = screen.getByTestId('post-ellipsis-button');

    userEvent.click(ellipsisButton);

    expect(setFeedPagePostOptionsModalShow).toBeCalled();
  });
});
