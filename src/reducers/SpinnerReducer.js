import {
    LOADING,
    READY,
} from '../actions/types';

const INITIAL_STATE = {
  isReady: false
};

export default (state = INITIAL_STATE, action) => {
  const { type } = action;
  switch (type) {
    case LOADING: {
      return { ...state, isReady: false };
    }
    case READY: {
      return { ...state, isReady: true };
    }
    default: return state;
  }
};
