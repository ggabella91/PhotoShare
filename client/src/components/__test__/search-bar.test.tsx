import { render } from '../../test-utils/test-utils';

import { SearchBar } from '../search-bar/search-bar.component';

import {
  getUserSuggestionsStart,
  clearUserSuggestions,
} from '../../redux/user/user.actions';
import '../../redux/post/post.actions';
import {
  getPostFileStart,
  clearSuggestionPhotoFileArray,
} from '../../redux/post/post.actions';

it('renders a search-bar component', () => {
  const { container: searchBar } = render(
    <SearchBar
      key={0}
      currentUser={null}
      getUserSuggestionsStart={() => getUserSuggestionsStart('test-user')}
      userSuggestions={null}
      userSuggestionsError={null}
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      userSuggestionProfilePhotoFiles={[]}
      userSuggestionsConfirm=''
      userSuggestionProfilePhotoConfirm=''
      clearUserSuggestions={() => clearUserSuggestions()}
      clearSuggestionPhotoFileArray={() => clearSuggestionPhotoFileArray()}
    />
  );

  expect(searchBar).toBeInTheDocument();
});
