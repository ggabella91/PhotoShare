import { render, screen, userEvent } from '../../test-utils/test-utils';

import { UpdateInfo } from '../update-info/update-info.component';

import { User } from '../../redux/user/user.types';

describe('update-info component tests', () => {
  const setup = () => {
    const changeInfoStart = jest.fn();
    const deleteAccountStart = jest.fn();
    const clearInfoStatuses = jest.fn();
    const currentUser: User = {
      id: '12345',
      username: 'testdude',
      name: 'Test Dude',
      email: 'test@email.com',
    };

    render(
      <UpdateInfo
        changeInfoStart={changeInfoStart}
        changeInfoError={null}
        changeInfoConfirm={null}
        deleteAccountStart={deleteAccountStart}
        clearInfoStatuses={clearInfoStatuses}
        currentUser={currentUser}
      />
    );

    return { changeInfoStart, deleteAccountStart, clearInfoStatuses };
  };

  it('renders update-info component', () => {
    setup();

    const updateInfo = screen.getByText(/Update your info/i);

    expect(updateInfo).toBeInTheDocument();
  });

  it('clicking update info button calls change info handler', () => {
    const { changeInfoStart } = setup();

    const updateInfoButton = screen.getByTestId('update-info-button');

    userEvent.click(updateInfoButton);

    expect(changeInfoStart).toBeCalled();
  });

  it('clicking delete account button calls causes delete account confirmation modal to be rendered', () => {
    setup();

    const deleteAccountButton = screen.getByTestId('delete-account-button');

    userEvent.click(deleteAccountButton);

    const deleteAccountConfirmModal = screen.getByText(
      /Confirm Account Deletion/i
    );

    expect(deleteAccountConfirmModal).toBeInTheDocument();
  });

  it('clicking delete account button in delete account confirmation modal calls delete-account handler', () => {
    const { deleteAccountStart } = setup();

    const deleteAccountButton = screen.getByTestId('delete-account-button');

    userEvent.click(deleteAccountButton);

    const deleteAccountConfirmButton = screen.getByTestId(
      'delete-account-confirm-button'
    );

    userEvent.click(deleteAccountConfirmButton);

    expect(deleteAccountStart).toBeCalled();
  });
});
