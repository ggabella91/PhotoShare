import { render, screen, userEvent } from '../../test-utils/test-utils';

import { SearchBar } from '../search-bar/search-bar.component';

import '../../redux/post/post.actions';

describe('renders a search-bar component', () => {
  const setup = () => {
    render(<SearchBar key={0} />);
  };

  it('renders a search bar component', () => {
    setup();

    const searchBar = screen.getByTestId('search-bar');

    expect(searchBar).toBeInTheDocument();
  });

  it('typing three or more characters in the search bar results in the user suggestion container component being rendered with no matches found', async () => {
    setup();

    const searchBarInput = screen.getByRole('textbox');

    userEvent.type(searchBarInput, 'test');

    await new Promise((resolve) => setTimeout(resolve, 0));

    const noMatchesSpan = screen.getByText(/No matches found/i);

    expect(noMatchesSpan).toBeInTheDocument();
  });
});
