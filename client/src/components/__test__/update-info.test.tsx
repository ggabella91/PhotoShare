import { render } from '../../test-utils/test-utils';

import { UpdateInfo } from '../update-info/update-info.component';
import {
  changeInfoStart,
  deleteAccountStart,
  clearInfoStatuses,
} from '../../redux/user/user.actions';

it('renders an update-info component', () => {
  const { container: updateInfo } = render(
    <UpdateInfo
      changeInfoStart={(infoPayload) => changeInfoStart(infoPayload)}
      changeInfoError={null}
      changeInfoConfirm={null}
      deleteAccountStart={() => deleteAccountStart()}
      clearInfoStatuses={() => clearInfoStatuses()}
      currentUser={null}
    />
  );

  expect(updateInfo).toBeInTheDocument();
});
