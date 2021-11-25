import { render } from '../../test-utils/test-utils';
import { SettingsPage } from '../settings-page/settings-page.component';

it('renders a settings page component', () => {
  const { container: settingsPageWrapper } = render(<SettingsPage />);

  expect(settingsPageWrapper).toBeInTheDocument();
});
