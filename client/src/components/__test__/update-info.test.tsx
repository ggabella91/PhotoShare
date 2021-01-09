import { shallow } from 'enzyme';
import React from 'react';
import { UpdateInfo } from '../update-info/update-info.component';
import {
  changeInfoStart,
  deleteAccountStart,
  clearInfoStatuses,
} from '../../redux/user/user.actions';

it('renders an update-info component', () => {
  const updateInfoWrapper = shallow(
    <UpdateInfo
      changeInfoStart={(infoPayload) => changeInfoStart(infoPayload)}
      changeInfoError={null}
      changeInfoConfirm={null}
      deleteAccountStart={() => deleteAccountStart()}
      clearInfoStatuses={() => clearInfoStatuses()}
      currentUser={null}
    />
  );

  expect(updateInfoWrapper).toMatchSnapshot();
});
