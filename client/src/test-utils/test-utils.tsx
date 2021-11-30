import { FC, ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import { store } from '../redux/store';

const WithReduxProvider: FC = ({ children }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const renderWithReduxAndRouter = (
  ui: ReactElement,
  { route = '/' } = {},
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  window.history.pushState({}, 'Test page', route);
  const customContainer = document.createElement('div');
  customContainer.id = 'root';

  return render(ui, {
    wrapper: WithReduxProvider,
    container: document.body.appendChild(customContainer),
    ...options,
  });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { renderWithReduxAndRouter as render };
