import { FC, ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import { store } from '../redux/store';

interface WrapperProps {
  wrapperProps?: { route: string; location: string };
}

type CustomRenderOptions = RenderOptions & WrapperProps;

const WithReduxProvider: FC<WrapperProps> = ({ children, wrapperProps }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={wrapperProps?.route || '/'} element={children} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

const renderWithReduxAndRouter = (
  ui: ReactElement,
  options?: Omit<CustomRenderOptions, 'wrapper'>
) => {
  window.history.pushState({}, '', options?.wrapperProps?.location || '/');
  const customContainer = document.createElement('div');
  customContainer.id = 'root';

  return render(ui, {
    wrapper: (props) => (
      <WithReduxProvider {...props} wrapperProps={options?.wrapperProps} />
    ),
    container: document.body.appendChild(customContainer),
    ...options,
  });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { renderWithReduxAndRouter as render };
