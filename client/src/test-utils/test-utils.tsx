import React, { FC, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { render, RenderOptions } from '@testing-library/react';
import { store } from '../redux/store';

const WithReduxProvider: FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const renderWithRedux = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: WithReduxProvider, ...options });

export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { renderWithRedux as render };
