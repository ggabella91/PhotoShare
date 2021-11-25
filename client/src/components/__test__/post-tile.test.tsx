import { render } from '../../test-utils/test-utils';
import PostTile from '../post-tile/post-tile.component';

it('expect to render a PostTile component', () => {
  const { container: postTile } = render(
    <PostTile
      fileString='hello'
      custRef={null}
      dataS3Key=''
      onClick={() => console.log('I was clicked!')}
    />
  );

  expect(postTile).toBeInTheDocument();
});
