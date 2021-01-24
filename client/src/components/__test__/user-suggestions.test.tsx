import { shallow } from 'enzyme';
import React from 'react';

import { UserSuggestions } from '../user-suggestions/user-suggestions.component';

it('renders a user-suggestions component', () => {
  const userSuggestionsWrapper = shallow(
    <UserSuggestions userSuggestionsArray={[]} />
  );

  expect(userSuggestionsWrapper).toMatchSnapshot();
});
