import { render, screen } from '../../test-utils/test-utils';
import { FeedPostContainer } from '../feed-post-container/feed-post-container.component';

import { Location } from '../../redux/post/post.types';

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
