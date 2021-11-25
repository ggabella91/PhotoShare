import { render } from '../../test-utils/test-utils';
import CustomModal from '../modal/modal.component';

it('renders a confirmation modal component', () => {
  const { container: customModal } = render(
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

  expect(customModal).toBeInTheDocument();
});
