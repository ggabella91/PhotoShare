import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root-reducer';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

const middlewares: Middleware[] = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export const store: Store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

// export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
