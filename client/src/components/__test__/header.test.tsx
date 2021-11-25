import { render } from '../../test-utils/test-utils';
import { Header } from '../header/header.component';
import { getPostFileStart } from '../../redux/post/post.actions';
import { signOutStart } from '../../redux/user/user.actions';

it('renders a header component', () => {
  const { container: header } = render(
    <Header
      currentUser={null}
      profilePhotoFile={null}
      profilePhotoKey='photo-key'
      getPostFileStart={(fileReq) => getPostFileStart(fileReq)}
      signOutStart={() => signOutStart()}
    />
  );
  expect(header).toBeInTheDocument();
});
