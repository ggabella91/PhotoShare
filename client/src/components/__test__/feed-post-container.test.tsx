import { shallow } from 'enzyme';
import React from 'react';
import FeedPostContainer from '../feed-post-container/feed-post-container.component';

it('expect to render a feed post container component', () => {
  const feedPostContainerWrapper = shallow(
    <FeedPostContainer
      caption='test caption'
      userInfo={{
        profilePhotoFileString: 'sndfjnbss',
        username: 'test-user',
        location: 'Bali',
        name: 'Test User',
      }}
      fileString='string'
      date='March 19th 2021'
    />
  );

  expect(feedPostContainerWrapper).toMatchSnapshot();
});
