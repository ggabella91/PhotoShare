import { render, screen } from '../../test-utils/test-utils';

import { FeedPage } from '../feed-page/feed-page.component';

describe('feed page component tests', () => {
  const setup = () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;
    console.error = jest.fn();

    render(<FeedPage />);
  };

  it('renders a feed page component without throwing an error', () => {
    setup();

    const feedPage = screen.getByTestId('feed-page');

    const feedPostContainers = screen.getAllByTestId('feed-post-container');

    expect(feedPage).toBeInTheDocument();
    expect(console.error).not.toHaveBeenCalled();
    expect(feedPostContainers.length).toEqual(4);
  });
});
