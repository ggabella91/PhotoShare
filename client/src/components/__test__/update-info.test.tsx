import { render, screen, userEvent } from '../../test-utils/test-utils';

import { UpdateInfo } from '../update-info/update-info.component';

describe('update-info component tests', () => {
  const setup = () => {
    console.error = jest.fn();
    const deleteAccountStart = jest.fn();
    const clearInfoStatuses = jest.fn();

    render(
      <UpdateInfo
        deleteAccountStart={deleteAccountStart}
        clearInfoStatuses={clearInfoStatuses}
      />
    );

    return { deleteAccountStart, clearInfoStatuses };
  };

  it('renders update-info component', () => {
    setup();

    const updateInfo = screen.getByText(/Update your info/i);

    expect(updateInfo).toBeInTheDocument();
  });

  it('clicking update info button calls change info handler without error', () => {
    setup();

    const updateInfoButton = screen.getByTestId('update-info-button');

    userEvent.click(updateInfoButton);

    expect(console.error).not.toHaveBeenCalled();
  });

  it('clicking delete account button calls causes delete account confirmation modal to be rendered', async () => {
    setup();

    const deleteAccountButton = screen.getByTestId('delete-account-button');

    userEvent.click(deleteAccountButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const deleteAccountConfirmModal = screen.getByTestId(
      'confirm-delete-modal'
    );

    expect(deleteAccountConfirmModal).toBeInTheDocument();
  });

  it('clicking delete account button in delete account confirmation modal calls delete-account handler', async () => {
    const { deleteAccountStart } = setup();

    const deleteAccountButton = screen.getByTestId('delete-account-button');

    userEvent.click(deleteAccountButton);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const deleteAccountConfirmButton = screen.getByTestId(
      'delete-account-confirm-button'
    );

    userEvent.click(deleteAccountConfirmButton);

    expect(deleteAccountStart).toBeCalled();
  });
});
