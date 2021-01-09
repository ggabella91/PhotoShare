import { shallow } from 'enzyme';
import React from 'react';
import { HomePage } from '../homepage/homepage.component';

import {
  createPostStart,
  clearPostStatuses,
} from '../../redux/post/post.actions';

it('renders a homepage component', () => {
  const homepageWrapper = shallow(
    <HomePage
      currentUser={null}
      createPostStart={(postRequest) => createPostStart(postRequest)}
      postConfirm={null}
      postError={null}
      clearPostStatuses={() => clearPostStatuses()}
    />
  );

  expect(homepageWrapper).toMatchSnapshot();
});
