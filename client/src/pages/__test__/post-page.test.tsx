import { render, screen } from '../../test-utils/test-utils';

import { PostPage } from '../post-page/post-page.component';

describe('post page component tests', () => {
  const setup = () => {
    render(<PostPage />, {
      wrapperProps: {
        route: '/p/:postId',
        location: '/p/kfdjvhb2438',
      },
    });
  };

  it('renders a post-page component', () => {
    setup();

    console.log('window.location.pathname: ', window.location.pathname);

    const postPage = screen.getByTestId('post-page');

    expect(postPage).toBeInTheDocument();
  });
});
