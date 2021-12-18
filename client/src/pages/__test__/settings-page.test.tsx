import { render, screen } from '../../test-utils/test-utils';
import { SettingsPage } from '../settings-page/settings-page.component';

describe('settings page component tests', () => {
  const setup = () => render(<SettingsPage />);

  it('renders a settings page component', () => {
    setup();

    const settingsPage = screen.getByTestId('settings-page');

    expect(settingsPage).toBeInTheDocument();
  });
});
