import { render, screen, userEvent } from '../../test-utils/test-utils';

import { SearchBar } from '../search-bar/search-bar.component';

import { User } from '../../redux/user/user.types';
import '../../redux/post/post.actions';
import { PostFile } from '../../redux/post/post.types';

describe('renders a search-bar component', () => {
  const setup = () => {
    const testUser = {} as User;
    const testUserArray = [{}, {}, {}] as User[];
    const testPostFileArray = [{}, {}, {}] as PostFile[];

    const getUserSuggestionsStart = jest.fn();
    const getPostFileStart = jest.fn();
    const clearUserSuggestions = jest.fn();
    const clearSuggestionPhotoFileArray = jest.fn();

    render(
      <SearchBar
        key={0}
        currentUser={testUser}
        getUserSuggestionsStart={getUserSuggestionsStart}
        userSuggestions={testUserArray}
        userSuggestionsError={null}
        getPostFileStart={getPostFileStart}
        userSuggestionProfilePhotoFiles={testPostFileArray}
        userSuggestionsConfirm=''
        userSuggestionProfilePhotoConfirm=''
        clearUserSuggestions={clearUserSuggestions}
        clearSuggestionPhotoFileArray={clearSuggestionPhotoFileArray}
      />
    );

    return {
      getUserSuggestionsStart,
      getPostFileStart,
      clearUserSuggestions,
      clearSuggestionPhotoFileArray,
    };
  };

  it('renders a search bar component', () => {
    setup();

    const searchBar = screen.getByTestId('search-bar');

    expect(searchBar).toBeInTheDocument();
  });

  it('typing three or more characters in the search bar results in the user suggestion container component being rendered', () => {
    setup();

    const searchBarInput = screen.getByRole('textbox');

    userEvent.type(searchBarInput, 'testing this out');

    const userSuggestionsContainer = screen.getByTestId(
      'user-suggestion-container'
    );

    expect(userSuggestionsContainer).toBeInTheDocument();
  });
});
