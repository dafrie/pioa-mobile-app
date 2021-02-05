import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducers from '../reducers';
import { stagingSync, logger, crashReporter } from '../middleware';
import { persistConfig } from './config';

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
    persistedReducer,
    {},
    //composeWithDevTools(applyMiddleware(thunk, logger, crashReporter, stagingSync))
    composeWithDevTools(applyMiddleware(thunk, stagingSync))
);

export const persistor = persistStore(store);
