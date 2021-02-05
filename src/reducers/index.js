import { combineReducers } from 'redux';
import { purgeStoredState } from 'redux-persist'

import { persistConfig } from '../store/config';

import spinner from './SpinnerReducer';
import auth from './AuthReducer';
import settings from './SettingsReducer';
import orm from './ORMReducer';
import uiPatients from './PatientsReducer';
import syncQueue from './SyncQueueReducer';

import { PURGE_STATE } from '../actions/types';

const appReducer = combineReducers({
  spinner,
  auth,
  settings,
  orm,
  uiPatients,
  syncQueue
});

const rootReducer = (state, action) => {
  if (action.type === PURGE_STATE) {
    state = undefined;
    purgeStoredState(persistConfig);
  }
  return appReducer(state, action);
};

export default rootReducer;
