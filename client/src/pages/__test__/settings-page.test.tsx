import { shallow } from 'enzyme';
import React from 'react';
import { SettingsPage } from '../settings-page/settings-page.component';

it('renders a settings page component', () => {
  const settingsPageWrapper = shallow(<SettingsPage />);

  expect(settingsPageWrapper).toMatchSnapshot();
});
