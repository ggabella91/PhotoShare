import { render, screen, userEvent } from '../../test-utils/test-utils';
import PostTile from '../post-tile/post-tile.component';

describe('expect to render a PostTile component', () => {
  const setup = () => {
    const handleClick = jest.fn();

    render(
      <PostTile
        id='test'
        fileString='hello'
        custRef={null}
        dataS3Key='test-s3-key'
        onClick={handleClick}
        postLikesCount={2}
        postCommentsCount={1}
      />
    );

    return { handleClick };
  };

  it('renders post tile component', () => {
    setup();

    const postTile = screen.getByRole('img');

    expect(postTile).toBeInTheDocument();
  });

  it('clicking the post tile image calls the click handler function', () => {
    const { handleClick } = setup();

    const postTileOverlay = screen.getByTestId('image-overlay');

    userEvent.click(postTileOverlay);

    expect(handleClick).toBeCalled();
  });
});
