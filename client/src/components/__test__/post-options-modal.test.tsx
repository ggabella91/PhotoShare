import { render } from '../../test-utils/test-utils';
import PostOptionsModal from '../post-or-comment-options-modal/post-or-comment-options-modal.component';

it('renders a post options modal', () => {
  const { container: postOptionsModal } = render(
    <PostOptionsModal
      show={true}
      onHide={() => {}}
      archive={() => {}}
      isCurrentUserPostOrComment={false}
      postOptionsModal={true}
    />
  );

  expect(postOptionsModal).toBeInTheDocument();
});
