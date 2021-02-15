import { shallow } from 'enzyme';
import React from 'react';

import { SearchBar } from '../search-bar/search-bar.component';

import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';
import '../../redux/post/post.actions';
import {
  getPostFileStart,
  clearUsersPhotoFileArray,
} from '../../redux/post/post.actions';

it('renders a search-bar component', () => {
  const searchBarWrapper = shallow(
    <SearchBar
      getUserSuggestionsStart={() => getUserSuggestionsStart('test-user')}
      userSuggestions={null}
      userSuggestionsError={null}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      userSuggestionProfilePhotoFiles={[]}
      userSuggestionsConfirm=''
      userSuggestionProfilePhotoConfirm=''
      clearUserSuggestions={() => clearUserSuggestions()}
      clearUserSuggestionPhotoFiles={() => clearUsersPhotoFileArray()}
    />
  );

  expect(searchBarWrapper).toMatchSnapshot();
});
