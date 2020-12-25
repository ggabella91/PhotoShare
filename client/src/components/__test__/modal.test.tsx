import { shallow } from 'enzyme';
import React from 'react';
import CustomModal from '../modal/modal.component';

it('renders a confirmation modal component', () => {
  const customModalWrapper = shallow(
    <CustomModal
      header='header-text'
      subheader='subheader-text'
      bodytext='body-text'
      show={true}
      onHide={() => {}}
      handleconfirm={() => {}}
      actionlabel='action-label'
    />
  );

  expect(customModalWrapper).toMatchSnapshot();
});
