import { shallow } from 'enzyme';
import React from 'react';
import PostTile from '../post-tile/post-tile.component';

it('expect to render a PostTile component', () => {
  const postTileWrapper = shallow(
    <PostTile
      fileString='hello'
      onClick={() => console.log('I was clicked!')}
    />
  );

  expect(postTileWrapper).toMatchSnapshot();
});
